import { type Page } from '@playwright/test'

export const DEMO_PASSWORD = 'password123'

export async function fillLoginForm(page: Page, email: string, password: string): Promise<void> {
  await page.getByRole('textbox', { name: /E-mail \*/ }).fill(email)
  await page.getByRole('textbox', { name: /Senha de Acesso/ }).fill(password)
}