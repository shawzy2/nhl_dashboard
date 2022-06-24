import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';
import annotationPlugin from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-gameflow-chart',
  templateUrl: './gameflow-chart.component.html',
  styleUrls: ['./gameflow-chart.component.scss']
})
export class GameflowChartComponent implements OnInit {

  @Input() gameflow: any = {};
  chart: any;
  myChartObject: any;
  goalTimesAway: Array<Number> = [];
  goalTimesHome: Array<Number> = [];
  totalTime: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.chart = document.getElementById('myChart');
    Chart.register(...registerables);
    Chart.register(annotationPlugin);
    this.loadChart();
  }

  loadChart(): void {

    // vertical lines for goals
    const arbitraryLine = {
      colorAway: this.gameflow.colorAway,
      colorHome: this.gameflow.colorHome,
      goalTimesAway: this.goalTimesAway,
      goalTimesHome: this.goalTimesHome,
      totalTime: this.totalTime,
      id: 'arbitraryLine',
      beforeDraw(chart: any, args: any, options: any) {
        const { 
          ctx, 
          chartArea: { top, right, bottom, left, width, height },
          scales: {x, y}
        } = chart;
        ctx.save();

        // draw line for each home/away goal
        let offset = 0;
        let barWidth = 3;
        for (let goalTime of this.goalTimesHome) {
          offset = Number(goalTime) / this.totalTime * width;
          ctx.fillStyle = this.colorHome + '80';
          ctx.fillRect(left + offset - (barWidth / 2), top, barWidth, height);
        }
        for (let goalTime of this.goalTimesAway) {
          offset = Number(goalTime) / this.totalTime * width;
          ctx.fillStyle = this.colorAway + '80';
          ctx.fillRect(left + offset - (barWidth / 2), top, barWidth, height);
        }

        ctx.restore();
      }
    }
    

    this.myChartObject = new Chart(this.chart, {
      type: 'line',
      data: {
        labels: this.gameflow.labels,
        datasets: [
          {
            label: this.gameflow.abbAway,
            data: this.gameflow.shotsAvgAway,
            pointRadius: 0,
            borderColor: this.gameflow.colorAway,
            backgroundColor: this.gameflow.colorAway + '10',
            fill: true,
            tension: 0.4
          },
          {
            label: this.gameflow.abbHome,
            data: this.gameflow.shotsAvgHome,
            pointRadius: 0,
            borderColor: this.gameflow.colorHome,
            backgroundColor: this.gameflow.colorHome + '10',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Shot Pace (Shots per 60 min)'
          },
          subtitle: {
            display: true,
            text: 'with Goals Scored (Vertical Bars)'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Shots on Goal per 60 Minutes'
            },
            min: 0
          }
        }
      },
      plugins: [arbitraryLine]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // reload chart with new data
    if (!changes['gameflow'].firstChange) {
      this.goalTimesAway = this.gameflow.goalTimesAway;
      this.goalTimesHome = this.gameflow.goalTimesHome;
      this.totalTime = this.gameflow.labels.length * 60 - 60;
      this.myChartObject.destroy();
      this.loadChart();
    }
  }

}
