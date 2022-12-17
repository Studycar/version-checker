import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementListItemonhandchildComponent } from './itemonhandchild.component';

describe('MaterialmanagementListItemonhandchildComponent', () => {
  let component: MaterialmanagementListItemonhandchildComponent;
  let fixture: ComponentFixture<MaterialmanagementListItemonhandchildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementListItemonhandchildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementListItemonhandchildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
