import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFictionDetails } from './non-fiction-details';

describe('NonFictionDetails', () => {
  let component: NonFictionDetails;
  let fixture: ComponentFixture<NonFictionDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonFictionDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonFictionDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
