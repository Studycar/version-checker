import { PlanscheduleModule } from './planschedule.module';

describe('PlanscheduleModule', () => {
  let planscheduleModule: PlanscheduleModule;

  beforeEach(() => {
    planscheduleModule = new PlanscheduleModule();
  });

  it('should create an instance', () => {
    expect(planscheduleModule).toBeTruthy();
  });
});
