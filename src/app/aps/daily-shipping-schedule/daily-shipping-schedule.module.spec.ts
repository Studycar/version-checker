import { DailyShippingScheduleModule } from './daily-shipping-schedule.module';

describe('DailyShippingScheduleModule', () => {
  let dailyShippingScheduleModule: DailyShippingScheduleModule;

  beforeEach(() => {
    dailyShippingScheduleModule = new DailyShippingScheduleModule();
  });

  it('should create an instance', () => {
    expect(dailyShippingScheduleModule).toBeTruthy();
  });
});
