import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-gameflow-chart',
  templateUrl: './gameflow-chart.component.html',
  styleUrls: ['./gameflow-chart.component.scss']
})
export class GameflowChartComponent implements OnInit {

  @Input() gameflow: any = {}
  chart: any;
  myChartObject: any;

  constructor() { }

  ngOnInit(): void {
    this.chart = document.getElementById('myChart');
    Chart.register(...registerables);
    this.loadChart();
  }

  loadChart(): void {
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
            text: 'Gameflow'
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
            }
          }
        }
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // reload chart with new data
    if(!changes['gameflow'].firstChange) {
      this.myChartObject.destroy();
      this.loadChart();
    }
  }

}
