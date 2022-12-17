import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceItemQuotaComponent } from './replace-item-quota.component';

describe('ReplaceItemQuotaComponent', () => {
  let component: ReplaceItemQuotaComponent;
  let fixture: ComponentFixture<ReplaceItemQuotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplaceItemQuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceItemQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
