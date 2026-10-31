import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

const PASSWORD = 'secret_sauce';

const SORT_CASES = {
    az: {
        names: [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ],
        prices: ['$29.99', '$9.99', '$15.99', '$49.99', '$7.99', '$15.99'],
    },
    za: {
        names: [
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Onesie',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Bike Light',
            'Sauce Labs Backpack',
        ],
        prices: ['$15.99', '$7.99', '$49.99', '$15.99', '$9.99', '$29.99'],
    },
    lohi: {
        names: [
            'Sauce Labs Onesie',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Backpack',
            'Sauce Labs Fleece Jacket',
        ],
        prices: ['$7.99', '$9.99', '$15.99', '$15.99', '$29.99', '$49.99'],
    },
    hilo: {
        names: [
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Backpack',
            'Sauce Labs Bolt T-Shirt',
            'Test.allTheThings() T-Shirt (Red)',
            'Sauce Labs Bike Light',
            'Sauce Labs Onesie',
        ],
        prices: ['$49.99', '$29.99', '$15.99', '$15.99', '$9.99', '$7.99'],
    },
} as const;

test.describe('Product sorting', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('standard_user', PASSWORD);
        await new InventoryPage(page).expectLoaded();
    });

    for (const [option, expected] of Object.entries(SORT_CASES) as Array<[
        keyof typeof SORT_CASES,
        (typeof SORT_CASES)[keyof typeof SORT_CASES],
    ]>) {
        test(`sorts products using ${option}`, async ({ page }) => {
            const inventory = new InventoryPage(page);

            await inventory.sortBy(option);
            await expect(inventory.sortDropdown).toHaveValue(option);
            await expect(inventory.inventoryItems).toHaveCount(expected.names.length);
            await expect(await inventory.productNames()).toEqual(expected.names);
            await expect(await inventory.productPrices()).toEqual(expected.prices);
        });
    }
});
