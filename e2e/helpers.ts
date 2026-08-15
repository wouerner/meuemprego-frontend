import { type Page, expect } from '@playwright/test'

export interface ProfessionalData {
  name: string
  email: string
  cpf: string
  headline: string
  linkedinUrl: string
  whatsappNumber: string
  area: string
  careerGoal: string
}

// Gera um CPF válido (algoritmo brasileiro) no formato 000.000.000-00.
export function generateValidCPF(): string {
  const randomDigits = (n: number): number[] =>
    Array.from({ length: n }, () => Math.floor(Math.random() * 10))

  const calcVerifier = (digits: number[]): number => {
    let sum = 0
    for (let i = 0; i < digits.length; i++) {
      sum += digits[i] * (digits.length + 1 - i)
    }
    const rest = (sum % 11)
    return rest < 2 ? 0 : 11 - rest
  }

  const base = randomDigits(9)
  const first = calcVerifier(base)
  const second = calcVerifier([...base, first])
  const all = [...base, first, second]

  // Rejeita CPFs com todos os dígitos repetidos (inválidos)
  if (new Set(all).size === 1) return generateValidCPF()

  const cpf = all.join('')
  return cpf.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

let emailCounter = 0
export function uniqueEmail(): string {
  emailCounter += 1
  const stamp = new Date().getTime()
  return `e2e.profissional.${stamp}.${emailCounter}@meuemprego.pro`
}

export function buildProfessionalData(overrides: Partial<ProfessionalData> = {}): ProfessionalData {
  const defaultWhatsapp = `55119${Math.floor(10000000 + Math.random() * 89999999)}`
  return {
    name: 'Ana Souza E2E',
    email: uniqueEmail(),
    cpf: generateValidCPF(),
    headline: 'Engenheira de Software Senior | Especialista Vue & Node',
    linkedinUrl: 'https://www.linkedin.com/in/ana-souza-e2e',
    whatsappNumber: defaultWhatsapp,
    area: 'Tecnologia da Informação',
    careerGoal: 'Busco uma vaga remota internacional de Tech Lead.',
    ...overrides,
  }
}

const PASSWORD = 'password123'

export async function fillCadastroForm(page: Page, data: ProfessionalData): Promise<void> {
  await page.getByLabel(/Nome Completo \*/).fill(data.name)
  await page.getByLabel(/E-mail Profissional \*/).fill(data.email)
  await page.getByLabel(/CPF \(Obrigatório/).fill(data.cpf)
  await page.getByRole('textbox', { name: /Senha de Acesso/ }).fill(PASSWORD)
  await page.getByRole('textbox', { name: /Confirmar Senha/ }).fill(PASSWORD)
  await page.getByLabel(/Título Profissional/).fill(data.headline)
  await page.getByLabel(/URL do Perfil no LinkedIn/).fill(data.linkedinUrl)
  await page.getByLabel(/Número do WhatsApp/).fill(data.whatsappNumber)
  await page.locator('.v-select').filter({ hasText: /Senioridade Atual/ }).click()
  await page.getByRole('option', { name: 'Senior' }).click()
  await page.locator('.v-select').filter({ hasText: /Área de Atuação/ }).click()
  await page.getByRole('option', { name: data.area }).click()
  await page.locator('.v-select').filter({ hasText: /Momento Profissional/ }).click()
  await page.getByRole('option', { name: 'Aberto a Propostas' }).click()
  await page.getByLabel(/Objetivo de Carreira/).fill(data.careerGoal)
}

export async function expectCadastroSuccessRedirect(page: Page): Promise<void> {
  await expect(page.getByText('Perfil e credenciais salvos com sucesso!')).toBeVisible({ timeout: 15_000 })
  await expect(page).toHaveURL(/\/hunters$/, { timeout: 15_000 })
}

export async function purgeProfessional(data: ProfessionalData): Promise<void> {
  // Cleanup is best-effort: there's no admin delete endpoint exposed to the UI.
  // The user record created during e2e is left in the database to guarantee
  // unique-email tests stay isolated. Logged for debugging.
  console.log(`[e2e] registered professional: ${data.email} (cpf ${data.cpf})`)
}