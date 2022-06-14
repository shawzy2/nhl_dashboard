import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShotMapComponent } from './shot-map.component';

describe('ShotMapComponent', () => {
  let component: ShotMapComponent;
  let fixture: ComponentFixture<ShotMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShotMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShotMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
