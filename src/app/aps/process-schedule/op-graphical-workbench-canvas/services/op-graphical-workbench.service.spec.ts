import { TestBed } from '@angular/core/testing';

import { OPGraphicalWorkbenchService } from './op-graphical-workbench.service';

describe('OPGraphicalWorkbenchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OPGraphicalWorkbenchService = TestBed.get(OPGraphicalWorkbenchService);
    expect(service).toBeTruthy();
  });
});
