import { ProcessScheduleModule } from './process-schedule.module';

describe('ProcessScheduleModule', () => {
  let processScheduleModule: ProcessScheduleModule;

  beforeEach(() => {
    processScheduleModule = new ProcessScheduleModule();
  });

  it('should create an instance', () => {
    expect(processScheduleModule).toBeTruthy();
  });
});
