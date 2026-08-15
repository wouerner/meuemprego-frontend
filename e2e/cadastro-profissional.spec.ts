import { test, expect } from '@playwright/test'
import {
  buildProfessionalData,
  fillCadastroForm,
  expectCadastroSuccessRedirect,
  purgeProfessional,
} from './helpers'

test.describe('Cadastro de Profissional (/cadastro)', () => {
  test('registro completo com sucesso redireciona para a vitrine', async ({ page }) => {
    const data = buildProfessionalData()

    await page.goto('/cadastro')
    await expect(page.getByRole('heading', { name: /Gestão de Perfil Profissional/ })).toBeVisible()

    await fillCadastroForm(page, data)
    await page.getByRole('button', { name: /Salvar Perfil e Credenciais/ }).click()

    await expectCadastroSuccessRedirect(page)
    purgeProfessional(data)
  })

  test('CPF inválido é bloqueado pela validação local', async ({ page }) => {
    const data = buildProfessionalData({ cpf: '111.111.111-11' })

    await page.goto('/cadastro')

    await fillCadastroForm(page, data)

    await expect(page.getByText(/CPF inválido/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Salvar Perfil e Credenciais/ })).toBeDisabled()
    await expect(page).toHaveURL(/\/cadastro$/)
    purgeProfessional(data)
  })

  test('CPF já cadastrado é bloqueado pelo backend', async ({ page }) => {
    // CPF 529.982.247-25 pertence ao demo user carlos@meuemprego.pro (seed).
    const data = buildProfessionalData({ cpf: '529.982.247-25' })

    await page.goto('/cadastro')

    await fillCadastroForm(page, data)
    await page.getByRole('button', { name: /Salvar Perfil e Credenciais/ }).click()

    await expect(page.getByText(/já cadastrado/i)).toBeVisible()
    await expect(page).toHaveURL(/\/cadastro$/)
    purgeProfessional(data)
  })
})