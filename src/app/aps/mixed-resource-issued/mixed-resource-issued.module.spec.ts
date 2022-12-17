import { MixedResourceIssuedModule } from './mixed-resource-issued.module';

describe('MixedResourceIssuedModule', () => {
  let mixedResourceIssuedModule: MixedResourceIssuedModule;

  beforeEach(() => {
    mixedResourceIssuedModule = new MixedResourceIssuedModule();
  });

  it('should create an instance', () => {
    expect(mixedResourceIssuedModule).toBeTruthy();
  });
});
