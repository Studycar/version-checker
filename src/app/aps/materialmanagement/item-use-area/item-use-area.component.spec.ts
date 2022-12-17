import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemUseAreaComponent } from './item-use-area.component';

describe('MixedResourceIssuedResourceIssuedPlatformAgComponent', () => {
  let component: ItemUseAreaComponent;
  let fixture: ComponentFixture<ItemUseAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemUseAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUseAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
