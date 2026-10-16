import { test, expect } from '@playwright/test';

test.describe('Carrinho e checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
  });

  test.describe('Catálogo', () => {
    test('CT-04: ordena produtos por preço do menor para o maior', async ({ page }) => {
      await page.getByTestId('product-sort-container').selectOption('lohi');

      const textos = await page.getByTestId('inventory-item-price').allInnerTexts();
      const precos = textos.map((texto) => Number(texto.replace('$', '')));
      const ordenados = [...precos].sort((a, b) => a - b);

      expect(precos).toEqual(ordenados);
    });
  });

  test.describe('Carrinho', () => {
    test('CT-05: adicionar produto atualiza o contador do carrinho', async ({ page }) => {
      await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
    });

    test('CT-06: remover produto esconde o contador do carrinho', async ({ page }) => {
      await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
      await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
      await page.getByTestId('remove-sauce-labs-backpack').click();
      await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
    });
  });

  test.describe('Checkout', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
      await page.getByTestId('shopping-cart-link').click();
      await page.getByTestId('checkout').click();
    });

    test('CT-07: compra completa com dados válidos', async ({ page }) => {
      await page.getByTestId('firstName').fill('Melissa');
      await page.getByTestId('lastName').fill('Goulart');
      await page.getByTestId('postalCode').fill('91520-222');
      await page.getByTestId('continue').click();
      await page.getByTestId('finish').click();
      await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    });

    test('CT-08: First Name vazio exibe erro', async ({ page }) => {
      await page.getByTestId('lastName').fill('Goulart');
      await page.getByTestId('postalCode').fill('91520-222');
      await page.getByTestId('continue').click();
      await expect(page.getByTestId('error')).toHaveText('Error: First Name is required');
    });

    test('CT-09: Last Name vazio exibe erro', async ({ page }) => {
      await page.getByTestId('firstName').fill('Melissa');
      await page.getByTestId('postalCode').fill('91520-222');
      await page.getByTestId('continue').click();
      await expect(page.getByTestId('error')).toHaveText('Error: Last Name is required');
    });

    test('CT-10: Postal Code vazio exibe erro', async ({ page }) => {
      await page.getByTestId('firstName').fill('Melissa');
      await page.getByTestId('lastName').fill('Goulart');
      await page.getByTestId('continue').click();
      await expect(page.getByTestId('error')).toHaveText('Error: Postal Code is required');
    });

    test('CT-11: um caractere em cada campo avança para o resumo', async ({ page }) => {
      await page.getByTestId('firstName').fill('A');
      await page.getByTestId('lastName').fill('B');
      await page.getByTestId('postalCode').fill('C');
      await page.getByTestId('continue').click();
      await expect(page).toHaveURL(/checkout-step-two/);
    });
  });
});