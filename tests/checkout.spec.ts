import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

const PASSWORD = 'secret_sauce';
const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Checkout flow', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', PASSWORD);
    await new InventoryPage(page).expectLoaded();
  });

  test('user can buy two items end to end', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    // Add two items and verify the badge
    await inventory.addToCart(BACKPACK);
    await inventory.addToCart(BIKE_LIGHT);
    await expect(inventory.cartBadge).toHaveText('2');

    // Read prices from the page rather than hardcoding the total
    const prices = [await inventory.priceOf(BACKPACK), await inventory.priceOf(BIKE_LIGHT)];
    const expectedTotal = prices
      .map((p) => Number(p.replace('$', '')))
      .reduce((sum, n) => sum + n, 0);

    // Cart contents
    await inventory.openCart();
    await cart.expectItems([BACKPACK, BIKE_LIGHT]);

    // Checkout
    await cart.startCheckout();
    await checkout.fillDetails('Test', 'User', '600001');
    await checkout.expectSubtotal(`$${expectedTotal.toFixed(2)}`);
    await checkout.finish();
    await checkout.expectOrderComplete();
  });

  test('checkout requires a first name', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addToCart(BACKPACK);
    await inventory.openCart();
    await cart.startCheckout();

    await checkout.lastName.fill('User');
    await checkout.postalCode.fill('600001');
    await checkout.continueButton.click();

    await expect(page.getByTestId('error')).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });

  test('removing the only item empties the cart', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await inventory.addToCart(BACKPACK);
    await inventory.openCart();
    await cart.expectItems([BACKPACK]);

    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(cart.items).toHaveCount(0);
  });
});
