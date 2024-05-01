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
  @Input() shotCategory: string = 'sf';
  @Input() data: any = {
    'Forwards': [],
    'Defensemen': [],
    'lineData': {}
  };
  shotMapData: any;
  lineGroups: LineGroup[] = [];
  playersInLine: any = ['noheadshot', 'noheadshot', 'noheadshot'];
  numGoals: number = 0;
  numShots: number = 0;
  numMissedShots: number = 0;
  numBlockedShots: number = 0;
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
    if (this.myChartObject) {
      this.clearData();
    }
  }

  // when user selects a line
  changeSelectedLineId(selectedLineId: any) {
    this.selectedLineId = selectedLineId;
    this.playersInLine = selectedLineId.split('_');
    this.shotMapData = this.data.lineData[selectedLineId];
    this.updateData();
  }

  changeCategory(category: any) {
    this.updateData();
  }

  loadChart(): void {
    const backgroundImage = {
      id: 'backgroundImage',
      beforeDraw: (chart: any) => {
        const image = new Image();
        image.src = 'assets/backgrounds/nhlRinkHalf.png';
        
        if (image.complete) {
          const ctx = chart.ctx;
          const {top, right, bottom, left, width, height} = chart.chartArea;
          ctx.drawImage(image, left, top, width, height);
        } else {
          image.onload = () => chart.draw();
        }
      }
    }

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
            min: 0,
            max: 100,
            ticks: {
              display: false
            },
            grid: {
              display: false
            }
          },
          y: {
            min: -42.5,
            max: 42.5,
            ticks: {
              display: false
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: true
          }
        },
        maintainAspectRatio: false,
      },
      plugins: [backgroundImage]
    });
  }

  updateData(): void {
    // update basic stats
    this.numGoals = this.shotMapData[this.shotCategory]['goal'].length;
    this.numShots = this.shotMapData[this.shotCategory]['shot-on-goal'].length;
    this.numMissedShots = this.shotMapData[this.shotCategory]['missed-shot'].length;
    this.numBlockedShots = this.shotMapData[this.shotCategory]['blocked-shot'].length;

    // update chart data
    this.myChartObject.data.datasets = [
      {
        label: 'goal',
        data: this.shotMapData[this.shotCategory]['goal'],
        backgroundColor: 'green',
        borderColor: 'black'
      },
      {
        label: 'shot',
        data: this.shotMapData[this.shotCategory]['shot-on-goal'],
        backgroundColor: 'red',
        borderColor: 'black'
      },
      {
        label: 'missed shot',
        data: this.shotMapData[this.shotCategory]['missed-shot'],
        backgroundColor: 'black',
        borderColor: 'black'
      },
      {
        label: 'blocked shot',
        data: this.shotMapData[this.shotCategory]['blocked-shot'],
        backgroundColor: 'orange',
        borderColor: 'black'
      }
    ]
    this.myChartObject.update();
  }

  clearData(): void {
    this.playersInLine = ['noheadshot', 'noheadshot', 'noheadshot'];
    this.numGoals = 0;
    this.numShots = 0;
    this.numMissedShots = 0;
    this.numBlockedShots = 0;
    this.myChartObject.data.datasets = [];
    this.myChartObject.update();
  }

}
