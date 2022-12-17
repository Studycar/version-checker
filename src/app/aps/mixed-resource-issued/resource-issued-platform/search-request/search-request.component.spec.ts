import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixedResourceIssuedSearchRequestComponent } from './search-request.component';

describe('SearchRequestComponent', () => {
  let component: MixedResourceIssuedSearchRequestComponent;
  let fixture: ComponentFixture<MixedResourceIssuedSearchRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixedResourceIssuedSearchRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixedResourceIssuedSearchRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
