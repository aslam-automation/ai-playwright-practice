import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  /** Returns the inventory card that contains the given product name. */
  private item(name: string): Locator {
    return this.page
      .getByTestId('inventory-item')
      .filter({ has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }) });
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  async priceOf(name: string): Promise<string> {
    return (await this.item(name).getByTestId('inventory-item-price').textContent()) ?? '';
  }

  async addToCart(name: string) {
    await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
