import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async expectItems(names: string[]) {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.items).toHaveCount(names.length);
    await expect(this.page.getByTestId('inventory-item-name')).toHaveText(names);
  }

  async startCheckout() {
    await this.checkoutButton.click();
  }
}
