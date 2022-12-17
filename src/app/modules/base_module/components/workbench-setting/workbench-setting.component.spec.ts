import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkbenchSettingImpComponent } from './workbench-setting.component';

describe('WorkbenchSettingImpComponent', () => {
  let component: WorkbenchSettingImpComponent;
  let fixture: ComponentFixture<WorkbenchSettingImpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkbenchSettingImpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkbenchSettingImpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
