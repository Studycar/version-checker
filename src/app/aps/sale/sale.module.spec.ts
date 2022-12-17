import {SaleModule} from './sale.module';


describe('SaleModule', () => {
  let saleModule: SaleModule;

  beforeEach(() => {
    saleModule = new SaleModule();
  });

  it('should create an instance', () => {
    expect(SaleModule).toBeTruthy();
  });
});
