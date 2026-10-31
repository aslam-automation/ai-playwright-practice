import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// Public demo credentials published on https://www.saucedemo.com
const PASSWORD = 'secret_sauce';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard user can log in and sees the product list', async ({ page }) => {
    await loginPage.login('standard_user', PASSWORD);

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
  });

  test('locked-out user sees an error and stays on the login page', async ({ page }) => {
    await loginPage.login('locked_out_user', PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('empty password shows a validation error', async ({ page }) => {
    await loginPage.username.fill('standard_user');
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('wrong password is rejected', async ({ page }) => {
    await loginPage.login('standard_user', 'wrong_password');

    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match any user in this service'
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
