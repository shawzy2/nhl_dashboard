import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

interface Line {
  lineId: string,
  SHOT: [],
  GOAL: [],
  BLOCKED_SHOT: [],
  MISSED_SHOT: []
}

interface LineGroup {
  positionStr: string,
  lines: []
}

@Component({
  selector: 'app-shot-map',
  templateUrl: './shot-map.component.html',
  styleUrls: ['./shot-map.component.scss']
})
export class ShotMapComponent implements OnInit {

  @Input() selectedLineId: string = '';
  @Input() shotMap: any = {
    'Forwards': [],
    'Defensemen': [],
    'lineData': {}
  };
  lineGroups: LineGroup[] = [];
  
  chart: any;
  myChartObject: any;
  EXAMPLE_SHOTS = {
    "sf": {
      "SHOT": [
        {
          "time": 551,
          "x": -75,
          "y": 27
        },
        {
          "time": 932,
          "x": -82,
          "y": 4
        },
        {
          "time": 1515,
          "x": -76,
          "y": 0
        },
        {
          "time": 1518,
          "x": -85,
          "y": 4
        },
        {
          "time": 1781,
          "x": -70,
          "y": -21
        },
        {
          "time": 2660,
          "x": -81,
          "y": 1
        }
      ],
      "GOAL": [
        {
          "time": 3457,
          "x": -84,
          "y": 6
        }
      ],
      "BLOCKED_SHOT": [
        {
          "time": 372,
          "x": -46,
          "y": -21
        },
        {
          "time": 547,
          "x": -55,
          "y": 1
        },
        {
          "time": 957,
          "x": -78,
          "y": 3
        },
        {
          "time": 2454,
          "x": -76,
          "y": -1
        },
        {
          "time": 2486,
          "x": -48,
          "y": -2
        },
        {
          "time": 3611,
          "x": -71,
          "y": 3
        },
        {
          "time": 3620,
          "x": -68,
          "y": -11
        }
      ],
      "MISSED_SHOT": [
        {
          "time": 63,
          "x": -35,
          "y": 33
        },
        {
          "time": 78,
          "x": -32,
          "y": -20
        },
        {
          "time": 2636,
          "x": -85,
          "y": -18
        },
        {
          "time": 3157,
          "x": -82,
          "y": -5
        },
        {
          "time": 3609,
          "x": -32,
          "y": 36
        }
      ]
    },
    "sa": {
      "SHOT": [
        {
          "time": 276,
          "x": 85,
          "y": 7
        },
        {
          "time": 359,
          "x": 43,
          "y": 0
        },
        {
          "time": 940,
          "x": 30,
          "y": -27
        },
        {
          "time": 1285,
          "x": 16,
          "y": -13
        },
        {
          "time": 3501,
          "x": 75,
          "y": 9
        }
      ],
      "GOAL": [],
      "BLOCKED_SHOT": [
        {
          "time": 1517,
          "x": -81,
          "y": 7
        },
        {
          "time": 1986,
          "x": 73,
          "y": 9
        }
      ],
      "MISSED_SHOT": []
    }
  }
  constructor() { }

  ngOnInit(): void {
    this.chart = document.getElementById('myChart');
    Chart.register(...registerables);
    // this.loadChart();
    console.log(this.shotMap);
    console.log(Object.keys(this.shotMap));
    console.log(Object.keys(this.shotMap));
  }

  loadChart(): void {
    // draw image as background
    const backgroundImage = {
      id: 'backgroundImage',
      beforeDraw: (chart: any) => {
        const image = new Image();
        image.src = 'assets/backgrounds/HockeyRink.png';
        
        if (image.complete) {
          const ctx = chart.ctx;
          const {top, left, width, height} = chart.chartArea;
          ctx.drawImage(image, left, top, width, height);
        } else {
          image.onload = () => chart.draw();
        }
      }
      // beforeDraw(chart: any, args: any, options: any) {
      //   const { 
      //     ctx, 
      //     chartArea: { top, right, bottom, left, width, height },
      //     scales: {x, y}
      //   } = chart;
      //   ctx.save();

      //   // draw image as background
      //   const image = new Image();
      //   image.src = 'assets/backgrounds/HockeyRink.png';

      //   // const homeLogo = new Image();
      //   // homeLogo.src = 'assets/logos/12.svg';
      //   // const awayLogo = new Image();
      //   // awayLogo.src = 'assets/logos/3.svg';
        
      //   if (image.complete) {
      //     const ctx = chart.ctx;
      //     const {top, left, width, height} = chart.chartArea;
      //     // below code is to center the image (not needed)
      //     const x = left + width / 2 - image.width / 2;
      //     const y = top + height / 2 - image.height / 2;
      //     ctx.drawImage(image, left, top, width, height);
      //     // ctx.drawImage(image, 0, 0, width, height);
      //     // ctx.drawImage(homeLogo, left, top, 40*homeLogo.width/homeLogo.height, 40);
      //     // ctx.drawImage(awayLogo, right - (40*awayLogo.width/awayLogo.height), top, 40*awayLogo.width/awayLogo.height, 40);
      //   } else {
      //     image.onload = () => chart.draw();
      //     // homeLogo.onload = () => chart.draw();
      //   }

      //   ctx.restore();
      // }
    }

    this.myChartObject = new Chart(this.chart, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'goal',
            data: this.shotMap.lineData[this.selectedLineId].GOAL,
            pointBackgroundColor: 'green',
            pointBorderColor: 'black'
          },
          {
            label: 'shot',
            data: this.shotMap.lineData[this.selectedLineId].SHOT,
            pointBackgroundColor: 'red',
            pointBorderColor: 'black'
          },
          {
            label: 'missed shot',
            data: this.shotMap.lineData[this.selectedLineId].MISSED_SHOT,
            pointBackgroundColor: 'black',
            pointBorderColor: 'black'
          },
          {
            label: 'blocked shot',
            data: this.shotMap.lineData[this.selectedLineId].BLOCKED_SHOT,
            pointBackgroundColor: 'black',
            pointBorderColor: 'black'
          }
        ]
      },
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
        }
      },
      plugins: [backgroundImage]
    });
  }

  changeSelectedLineId(selectedLineId: any) {
    if(this.myChartObject){
      this.myChartObject.destroy();
    }

    // this.selectedLineId = selectedLineId;
    console.log(selectedLineId);
    console.log(this.shotMap.lineData[selectedLineId]);
    this.loadChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // reload chart with new data
    if (!changes['shotMap'].firstChange) {
      console.log(this.shotMap);
      
      this.lineGroups = [
        {
          positionStr: 'Forwards',
          lines: this.shotMap['Forwards']
        },
        {
          positionStr: 'Defensemen',
          lines: this.shotMap['Defensemen']
        }
      ]
  
      console.log(this.lineGroups);
    }
  }

}
