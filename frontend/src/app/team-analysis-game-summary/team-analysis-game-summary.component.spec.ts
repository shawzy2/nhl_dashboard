import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAnalysisGameSummaryComponent } from './team-analysis-game-summary.component';

describe('TeamAnalysisGameSummaryComponent', () => {
  let component: TeamAnalysisGameSummaryComponent;
  let fixture: ComponentFixture<TeamAnalysisGameSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamAnalysisGameSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAnalysisGameSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
