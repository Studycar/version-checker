import { ConcurrentRequestModule } from './concurrent-request.module';

describe('ConcurrentRequestModule', () => {
  let concurrentRequestModule: ConcurrentRequestModule;

  beforeEach(() => {
    concurrentRequestModule = new ConcurrentRequestModule();
  });

  it('should create an instance', () => {
    expect(concurrentRequestModule).toBeTruthy();
  });
});
