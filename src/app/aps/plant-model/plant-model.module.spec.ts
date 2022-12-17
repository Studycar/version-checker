import { PlantModelModule } from './plant-model.module';

describe('PlantModelModule', () => {
  let plantModelModule: PlantModelModule;

  beforeEach(() => {
    plantModelModule = new PlantModelModule();
  });

  it('should create an instance', () => {
    expect(plantModelModule).toBeTruthy();
  });
});
