import { TestBed } from '@angular/core/testing';

import { TabAgStateService } from '../../../shared/directive/tab-ag-state/tab-ag-state.service';

describe('TabAgStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabAgStateService = TestBed.get(TabAgStateService);
    expect(service).toBeTruthy();
  });
});
