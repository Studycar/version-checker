import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparationPlatformNoticeQueryCancelComponent } from './notice-query-cancel.component';

describe('PreparationPlatformNoticeQueryCancelComponent', () => {
  let component: PreparationPlatformNoticeQueryCancelComponent;
  let fixture: ComponentFixture<PreparationPlatformNoticeQueryCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparationPlatformNoticeQueryCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparationPlatformNoticeQueryCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
