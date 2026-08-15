import { test, expect } from '@playwright/test'
import { fillLoginForm, DEMO_PASSWORD } from './login-helpers'

test.describe('Login na Plataforma (/login)', () => {
  test('login do administrador redireciona para /admin', async ({ page }) => {
    await page.goto('/login')

    await fillLoginForm(page, 'admin@meuemprego.pro', DEMO_PASSWORD)
    await page.getByRole('button', { name: /Entrar na Plataforma/ }).click()

    await expect(page.getByText(/Perfil identificado: Administrador/i)).toBeVisible()
    await expect(page).toHaveURL(/\/admin$/, { timeout: 15_000 })
  })

  test('login do job hunter redireciona para /candidatos (talent pool)', async ({ page }) => {
    await page.goto('/login')

    await fillLoginForm(page, 'juliana.hunter@meuemprego.pro', DEMO_PASSWORD)
    await page.getByRole('button', { name: /Entrar na Plataforma/ }).click()

    await expect(page.getByText(/Perfil identificado: Job Hunter/i)).toBeVisible()
    await expect(page).toHaveURL(/\/candidatos$/, { timeout: 15_000 })
  })

  test('login do profissional (candidato) redireciona para /hunters (pedidos de acesso)', async ({ page }) => {
    await page.goto('/login')

    await fillLoginForm(page, 'carlos@meuemprego.pro', DEMO_PASSWORD)
    await page.getByRole('button', { name: /Entrar na Plataforma/ }).click()

    await expect(page.getByText(/Perfil identificado: Perfil Profissional/i)).toBeVisible()
    await expect(page).toHaveURL(/\/hunters$/, { timeout: 15_000 })
  })

  test('credenciais inválidas exibem erro e permanecem no /login', async ({ page }) => {
    await page.goto('/login')

    await fillLoginForm(page, 'admin@meuemprego.pro', 'senha-errada')
    await page.getByRole('button', { name: /Entrar na Plataforma/ }).click()

    await expect(page.getByText(/credenciais inválidas/i)).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })
})