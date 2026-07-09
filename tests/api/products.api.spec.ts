import { expect, test } from '@playwright/test';
import { AutomationExerciseClient, type Product } from '../../api/automationExerciseClient';

function expectProductFields(product: Product) {
  expect(product.id).toEqual(expect.any(Number));
  expect(product.name).toEqual(expect.any(String));
  expect(product.price).toEqual(expect.any(String));
  expect(product.brand).toEqual(expect.any(String));
  expect(product.category).toEqual(
    expect.objectContaining({
      category: expect.any(String),
      usertype: expect.objectContaining({
        usertype: expect.any(String)
      })
    })
  );
}

test.describe('Products API @api', () => {
  test('GET all products list returns product data @api @sanity', async ({ request }) => {
    const apiClient = new AutomationExerciseClient(request);

    const { response, body } = await apiClient.getProductsList();

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    expectProductFields(body.products[0]);
    expect(body.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          name: 'Blue Top'
        })
      ])
    );
  });

  test('POST search product returns matching products @api @regression', async ({ request }) => {
    const apiClient = new AutomationExerciseClient(request);

    const { response, body } = await apiClient.searchProducts('Blue Top');

    expect(response.status()).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    expectProductFields(body.products[0]);
    expect(body.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          name: 'Blue Top'
        })
      ])
    );
  });
});
