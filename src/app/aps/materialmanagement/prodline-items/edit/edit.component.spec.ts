import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementProdlineItemsEditComponent } from './edit.component';

describe('MaterialmanagementProdlineItemsEditComponent', () => {
  let component: MaterialmanagementProdlineItemsEditComponent;
  let fixture: ComponentFixture<MaterialmanagementProdlineItemsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementProdlineItemsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementProdlineItemsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
