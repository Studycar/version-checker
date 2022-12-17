import { ProductSellBalanceModule } from './product-sell-balance.module';

describe('ProductSellBalanceModule', () => {
  let productSellBalanceModule: ProductSellBalanceModule;

  beforeEach(() => {
    productSellBalanceModule = new ProductSellBalanceModule();
  });

  it('should create an instance', () => {
    expect(productSellBalanceModule).toBeTruthy();
  });
});
