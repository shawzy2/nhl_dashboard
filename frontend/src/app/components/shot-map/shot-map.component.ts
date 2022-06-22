import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

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
  @Input() awayLogo: string = '';
  @Input() homeLogo: string = '';
  @Input() shotMap: any = {
    'Forwards': [],
    'Defensemen': [],
    'lineData': {}
  };
  lineGroups: LineGroup[] = [];
  SHOT = [{time: 2289, x: -68, y: -13}];
  GOAL = [];
  BLOCKED_SHOT = [];
  MISSED_SHOT = [];
  
  chart: any;
  myChartObject: any;
  constructor() { }

  ngOnInit(): void {
    this.chart = document.getElementById('myChartShotMap');
    Chart.register(...registerables);
    this.loadChart();
    console.log(this.myChartObject);
    console.log(this.shotMap);
    console.log(Object.keys(this.shotMap));
    console.log(Object.keys(this.shotMap));
  }

  loadChart(): void {
    if(this.myChartObject){
      this.myChartObject.destroy();
    }

    // draw image as background
    const backgroundImage = {
      id: 'backgroundImage',
      beforeDraw: (chart: any) => {
        const image = new Image();
        const homeLogo = new Image();
        const awayLogo = new Image();
        image.src = 'assets/backgrounds/HockeyRink.png';
        homeLogo.src = this.homeLogo.slice(1);
        awayLogo.src = this.awayLogo.slice(1);
        
        if (image.complete) {
          const ctx = chart.ctx;
          const {top, right, bottom, left, width, height} = chart.chartArea;
          ctx.drawImage(image, left, top, width, height);
          ctx.drawImage(homeLogo, left, top, 40*homeLogo.width/homeLogo.height, 40);
          ctx.drawImage(awayLogo, right - (40*awayLogo.width/awayLogo.height), top, 40*awayLogo.width/awayLogo.height, 40);
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

    console.log('loading chart');
    console.log(this.chart);
    this.myChartObject = new Chart(this.chart, {
      type: 'scatter',
      data: {
        datasets: [
          // {
          //   label: 'goal',
          //   data: this.shotMap.lineData[this.selectedLineId].GOAL,
          //   backgroundColor: 'green',
          //   borderColor: 'black'
          // },
          // {
          //   label: 'shot',
          //   data: this.shotMap.lineData[this.selectedLineId].SHOT,
          //   backgroundColor: 'red',
          //   borderColor: 'black'
          // },
          // {
          //   label: 'missed shot',
          //   data: this.shotMap.lineData[this.selectedLineId].MISSED_SHOT,
          //   backgroundColor: 'black',
          //   borderColor: 'black'
          // },
          // {
          //   label: 'blocked shot',
          //   data: this.shotMap.lineData[this.selectedLineId].BLOCKED_SHOT,
          //   backgroundColor: 'orange',
          //   borderColor: 'black'
          // }
          // {
          //   label: 'goal',
          //   data: this.GOAL,
          //   backgroundColor: 'green',
          //   borderColor: 'black'
          // },
          {
            label: 'shot',
            data: this.SHOT,
            backgroundColor: 'red',
            borderColor: 'black'
          },
          // {
          //   label: 'missed shot',
          //   data: this.MISSED_SHOT,
          //   backgroundColor: 'black',
          //   borderColor: 'black'
          // },
          // {
          //   label: 'blocked shot',
          //   data: this.BLOCKED_SHOT,
          //   backgroundColor: 'orange',
          //   borderColor: 'black'
          // }
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
      },
      plugins: [backgroundImage]
    });
  }

  changeSelectedLineId(selectedLineId: any) {
    // this.selectedLineId = selectedLineId;
    console.log(this.chart);
    if(this.myChartObject){
      this.myChartObject.destroy();
      console.log(this.chart);
    }

    console.log(selectedLineId);
    console.log(this.shotMap.lineData[selectedLineId]);
    console.log(this.awayLogo);
    console.log(this.homeLogo);
    this.loadChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // reload chart with new data
    // if(this.myChartObject){
    //   this.myChartObject.destroy();
    // }

    if (!changes['shotMap'].firstChange) {
      console.log(this.shotMap);

      this.selectedLineId = '';
      this.lineGroups = [
        {
          positionStr: 'Forwards',
          lines: this.shotMap['Forwards']
        },
        {
          positionStr: 'Defensemen',
          lines: this.shotMap['Defensemen']
        }
      ];
    }
  }

}
