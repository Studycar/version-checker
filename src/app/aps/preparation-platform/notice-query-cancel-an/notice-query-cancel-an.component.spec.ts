import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformNoticeQueryCancelAnComponent } from './notice-query-cancel-an.component';

describe('PreparationPlatformNoticeQueryCancelComponent', () => {
  let component: PreparationPlatformNoticeQueryCancelAnComponent;
  let fixture: ComponentFixture<PreparationPlatformNoticeQueryCancelAnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformNoticeQueryCancelAnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformNoticeQueryCancelAnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
