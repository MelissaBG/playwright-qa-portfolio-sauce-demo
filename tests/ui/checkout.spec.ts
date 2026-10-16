import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Carrinho e checkout', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test.describe('Catálogo', () => {
    test('CT-04: ordena produtos por preço do menor para o maior', async () => {
      await inventoryPage.sortBy('lohi');
      const precos = await inventoryPage.getPrices();
      const ordenados = [...precos].sort((a, b) => a - b);
      expect(precos).toEqual(ordenados);
    });
  });

  test.describe('Carrinho', () => {
    test('CT-05: adicionar produto atualiza o contador do carrinho', async () => {
      await inventoryPage.addToCart('sauce-labs-backpack');
      await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    test('CT-06: remover produto esconde o contador do carrinho', async () => {
      await inventoryPage.addToCart('sauce-labs-backpack');
      await expect(inventoryPage.cartBadge).toHaveText('1');
      await inventoryPage.removeFromCart('sauce-labs-backpack');
      await expect(inventoryPage.cartBadge).toBeHidden();
    });
  });

  test.describe('Checkout', () => {
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
      const cartPage = new CartPage(page);
      checkoutPage = new CheckoutPage(page);
      await inventoryPage.addToCart('sauce-labs-backpack');
      await inventoryPage.openCart();
      await cartPage.checkout();
    });

    test('CT-07: compra completa com dados válidos', async () => {
      await checkoutPage.fillInformation('Melissa', 'Goulart', '91520-222');
      await checkoutPage.continueCheckout();
      await checkoutPage.finish();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    });

    test('CT-08: First Name vazio exibe erro', async () => {
      await checkoutPage.fillInformation('', 'Goulart', '91520-222');
      await checkoutPage.continueCheckout();
      await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
    });

    test('CT-09: Last Name vazio exibe erro', async () => {
      await checkoutPage.fillInformation('Melissa', '', '91520-222');
      await checkoutPage.continueCheckout();
      await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
    });

    test('CT-10: Postal Code vazio exibe erro', async () => {
      await checkoutPage.fillInformation('Melissa', 'Goulart', '');
      await checkoutPage.continueCheckout();
      await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
    });

    test('CT-11: um caractere em cada campo avança para o resumo', async ({ page }) => {
      await checkoutPage.fillInformation('A', 'B', 'C');
      await checkoutPage.continueCheckout();
      await expect(page).toHaveURL(/checkout-step-two/);
    });
  });
});