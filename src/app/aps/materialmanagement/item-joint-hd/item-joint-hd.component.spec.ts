import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemJointHDComponent } from './item-joint-hd.component';

describe('ItemJointHDComponent', () => {
  let component: ItemJointHDComponent;
  let fixture: ComponentFixture<ItemJointHDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemJointHDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemJointHDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
