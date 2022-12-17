import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestDiagnosisFormComponent } from './diagnosis-form.component';

describe('ConcurrentRequestDiagnosisFormComponent', () => {
  let component: ConcurrentRequestDiagnosisFormComponent;
  let fixture: ComponentFixture<ConcurrentRequestDiagnosisFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConcurrentRequestDiagnosisFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestDiagnosisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
