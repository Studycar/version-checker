import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MobBatchReleaseEditComponent } from './edit.component';

describe('MobBatchReleaseEditComponent', () => {
  let component: MobBatchReleaseEditComponent;
  let fixture: ComponentFixture<MobBatchReleaseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobBatchReleaseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobBatchReleaseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
