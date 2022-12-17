import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemJointHDEditComponent } from './edit.component';

describe('ItemJointHDEditComponent', () => {
  let component: ItemJointHDEditComponent;
  let fixture: ComponentFixture<ItemJointHDEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemJointHDEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemJointHDEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
