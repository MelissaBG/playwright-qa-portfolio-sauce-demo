import{test, expect} from '@playwright/test';

test('login com usuário valido', async ({page})=> {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByRole('button', {name:'Login'}).click();
    await expect(page).toHaveURL(/inventory/);

});