import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

interface LineGroup {
  positionStr: string,
  lines: []
}

@Component({
  selector: 'app-shot-rink',
  templateUrl: './shot-rink.component.html',
  styleUrls: ['./shot-rink.component.scss']
})
export class ShotRinkComponent implements OnInit {
  
  @Input() selectedLineId: string = '';
  @Input() data: any = {
    'Forwards': [],
    'Defensemen': [],
    'lineData': {}
  };
  shotMapData: any;
  lineGroups: LineGroup[] = [];
  chart: any;
  myChartObject: any;

  constructor() { }

  ngOnInit(): void {
    this.chart = document.getElementById('myChartShotRink');
    Chart.register(...registerables);
    this.loadChart();
  }

  // when user selects a new game
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['data'].firstChange) {
      console.log(this.data);

      this.selectedLineId = '';
      this.lineGroups = [
        {
          positionStr: 'Forwards',
          lines: this.data['Forwards']
        },
        {
          positionStr: 'Defensemen',
          lines: this.data['Defensemen']
        }
      ];
    }
  }

  // when user selects a line
  changeSelectedLineId(selectedLineId: any) {
    this.selectedLineId = selectedLineId;
    this.shotMapData = this.data.lineData[selectedLineId];
    console.log(this.shotMapData);

    this.updateData();

  }

  loadChart(): void {
    this.myChartObject = new Chart(this.chart, {
      type: 'scatter',
      data: { datasets: [] },
      options: {
        elements: {
          point: {
            radius: 6,
            hoverRadius: 12
          }
        },
        scales: {
          x: {
            min: -100,
            max: 100,
            ticks: {
              display: true
            },
            grid: {
              display: true
            }
          },
          y: {
            min: -42.5,
            max: 42.5,
            ticks: {
              display: true
            },
            grid: {
              display: true
            }
          }
        },
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }

  updateData(): void {
    this.myChartObject.data.datasets = [
      {
        label: 'goal',
        data: this.shotMapData.GOAL,
        backgroundColor: 'green',
        borderColor: 'black'
      },
      {
        label: 'shot',
        data: this.shotMapData.SHOT,
        backgroundColor: 'red',
        borderColor: 'black'
      },
      {
        label: 'missed shot',
        data: this.shotMapData.MISSED_SHOT,
        backgroundColor: 'black',
        borderColor: 'black'
      },
      {
        label: 'blocked shot',
        data: this.shotMapData.BLOCKED_SHOT,
        backgroundColor: 'orange',
        borderColor: 'black'
      }
    ]
    this.myChartObject.update();
  }

}
