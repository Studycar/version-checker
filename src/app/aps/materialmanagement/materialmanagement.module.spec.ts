import { MaterialmanagementModule } from './materialmanagement.module';

describe('MaterialmanagementModule', () => {
  let materialmanagementModule: MaterialmanagementModule;

  beforeEach(() => {
    materialmanagementModule = new MaterialmanagementModule();
  });

  it('should create an instance', () => {
    expect(materialmanagementModule).toBeTruthy();
  });
});
