import { TestBed } from '@angular/core/testing';

import { PlantPlatformService } from './plant-platform.service';

describe('PlantPlatformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlantPlatformService = TestBed.get(PlantPlatformService);
    expect(service).toBeTruthy();
  });
});
