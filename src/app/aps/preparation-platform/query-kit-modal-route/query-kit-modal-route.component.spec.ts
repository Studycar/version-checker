import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryKitModalRouteComponent } from './query-kit-modal-route.component';

describe('QueryKitModalRouteComponent', () => {
  let component: QueryKitModalRouteComponent;
  let fixture: ComponentFixture<QueryKitModalRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryKitModalRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryKitModalRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
