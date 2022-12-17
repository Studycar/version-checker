import { SharePlanModule } from './share-plan.module';

describe('SharePlanModule', () => {
  let sharePlanModule: SharePlanModule;

  beforeEach(() => {
    sharePlanModule = new SharePlanModule();
  });

  it('should create an instance', () => {
    expect(sharePlanModule).toBeTruthy();
  });
});
