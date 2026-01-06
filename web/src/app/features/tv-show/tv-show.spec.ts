import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvShow } from './tv-show';

describe('TvShow', () => {
  let component: TvShow;
  let fixture: ComponentFixture<TvShow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvShow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvShow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
