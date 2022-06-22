import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShotRinkComponent } from './shot-rink.component';

describe('ShotRinkComponent', () => {
  let component: ShotRinkComponent;
  let fixture: ComponentFixture<ShotRinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShotRinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShotRinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
