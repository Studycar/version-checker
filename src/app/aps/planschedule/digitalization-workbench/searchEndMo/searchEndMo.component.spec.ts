import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchEndMoComponent } from './searchEndMo.component';

describe('SearchEndMoComponent', () => {
  let component: SearchEndMoComponent;
  let fixture: ComponentFixture<SearchEndMoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchEndMoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEndMoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
