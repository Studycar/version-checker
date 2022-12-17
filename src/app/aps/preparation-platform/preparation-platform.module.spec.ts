import { PreparationPlatformModule } from './preparation-platform.module';

describe('PreparationPlatformModule', () => {
  let preparationPlatformModule: PreparationPlatformModule;

  beforeEach(() => {
    preparationPlatformModule = new PreparationPlatformModule();
  });

  it('should create an instance', () => {
    expect(preparationPlatformModule).toBeTruthy();
  });
});
