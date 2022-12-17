import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialmanagementProdlineItemsComponent } from './prodline-items.component';

describe('MaterialmanagementProdlineItemsComponent', () => {
  let component: MaterialmanagementProdlineItemsComponent;
  let fixture: ComponentFixture<MaterialmanagementProdlineItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialmanagementProdlineItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialmanagementProdlineItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
