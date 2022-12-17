import { TestBed } from '@angular/core/testing';

import { WorkbenchSettingService } from './workbench-setting.service';

describe('WorkbenchSettingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkbenchSettingService = TestBed.get(WorkbenchSettingService);
    expect(service).toBeTruthy();
  });
});
