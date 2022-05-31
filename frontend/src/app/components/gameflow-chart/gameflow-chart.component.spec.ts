import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameflowChartComponent } from './gameflow-chart.component';

describe('GameflowChartComponent', () => {
  let component: GameflowChartComponent;
  let fixture: ComponentFixture<GameflowChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameflowChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameflowChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
