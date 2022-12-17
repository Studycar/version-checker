import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementItemonhandqueryComponent } from './itemonhandquery.component';

describe('MaterialmanagementItemonhandqueryComponent', () => {
  let component: MaterialmanagementItemonhandqueryComponent;
  let fixture: ComponentFixture<MaterialmanagementItemonhandqueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementItemonhandqueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementItemonhandqueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
