import { TestBed, inject } from '@angular/core/testing';

import { BaseBillNoRuleServiceService } from './base-bill-no-rule-service.service';

describe('BaseBillNoRuleServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseBillNoRuleServiceService]
    });
  });

  it('should be created', inject([BaseBillNoRuleServiceService], (service: BaseBillNoRuleServiceService) => {
    expect(service).toBeTruthy();
  }));
});
