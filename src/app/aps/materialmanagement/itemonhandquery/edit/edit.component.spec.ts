import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementItemonhandqueryEditComponent } from './edit.component';

describe('MaterialmanagementItemonhandqueryEditComponent', () => {
  let component: MaterialmanagementItemonhandqueryEditComponent;
  let fixture: ComponentFixture<MaterialmanagementItemonhandqueryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementItemonhandqueryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementItemonhandqueryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
