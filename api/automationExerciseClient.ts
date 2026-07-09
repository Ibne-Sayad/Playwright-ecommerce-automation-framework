import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface ProductCategory {
  usertype: {
    usertype: string;
  };
  category: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: ProductCategory;
}

export interface ProductsApiResponse {
  responseCode: number;
  products: Product[];
}

export interface ApiResult<T> {
  response: APIResponse;
  body: T;
}

export class AutomationExerciseClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProductsList(): Promise<ApiResult<ProductsApiResponse>> {
    const response = await this.request.get('/api/productsList');

    return this.parseJsonResponse<ProductsApiResponse>(response);
  }

  async searchProducts(searchProduct: string): Promise<ApiResult<ProductsApiResponse>> {
    const response = await this.request.post('/api/searchProduct', {
      form: {
        search_product: searchProduct
      }
    });

    return this.parseJsonResponse<ProductsApiResponse>(response);
  }

  private async parseJsonResponse<T>(response: APIResponse): Promise<ApiResult<T>> {
    const responseText = await response.text();

    return {
      response,
      body: JSON.parse(responseText) as T
    };
  }
}
