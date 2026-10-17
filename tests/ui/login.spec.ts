import { test, expect } from '../../fixtures';

test.describe('Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('CT-01: login com usuário válido', async ({ page, loginPage }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('CT-02: login com usuário bloqueado', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('CT-03: login sem senha', async ({ loginPage }) => {
    await loginPage.login('standard_user', '');
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
  });
});