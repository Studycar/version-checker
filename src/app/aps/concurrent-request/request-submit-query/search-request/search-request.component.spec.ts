import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcurrentRequestSearchRequestComponent } from './search-request.component';

describe('SearchRequestComponent', () => {
  let component: ConcurrentRequestSearchRequestComponent;
  let fixture: ComponentFixture<ConcurrentRequestSearchRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcurrentRequestSearchRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcurrentRequestSearchRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
