import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Constants } from '../../utils/constants';
import {Router} from "@angular/router";

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ChartDataLabels);

interface AppealEntry {
  name: string;
  ri: number | null;
  ra: number | null;
  rf: number | null;
}

@Component({
  selector: 'app-en-appeals',
  templateUrl: './en-appeals.component.html',
  styleUrls: ['./en-appeals.component.css']
})
export class EnAppealsComponent implements OnInit {
  protected readonly Constants = Constants;

  entries: AppealEntry[] = [];
  contestedEntries: AppealEntry[] = [];

  total = 0;
  increased = 0;
  decreased = 0;
  unchanged = 0;
  meanDiff = 0;

  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  barChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    }
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>(Constants.DATA_API_BASE_EN_APPEALS_URL).subscribe(data => {
      this.entries = data.filter(e => e.ri !== null);
      this.contestedEntries = this.entries.filter(e => e.ra !== null && e.rf !== null);

      this.total = this.contestedEntries.length;
      this.increased = this.contestedEntries.filter(e => e.ra! > e.ri!).length;
      this.decreased = this.contestedEntries.filter(e => e.ra! < e.ri!).length;
      this.unchanged = this.contestedEntries.filter(e => e.ra === e.ri).length;

      const totalDiff = this.contestedEntries.reduce((acc, e) => acc + (e.ra! - e.ri!), 0);
      this.meanDiff = parseFloat((totalDiff / this.total).toFixed(3));

      this.prepareLineChart();
      this.prepareBarChart();
    });
  }

  prepareLineChart(): void {
    const sorted = [...this.contestedEntries].sort((a, b) => a.ri! - b.ri!);
    this.lineChartData = {
      labels: sorted.map(e => e.name),
      datasets: [
        {
          label: Constants.EN_APPEALS_PAGE.INITIAL_GRADE,
          data: sorted.map(e => e.ri!),
          borderColor: 'blue',
          fill: false
        },
        {
          label: Constants.EN_APPEALS_PAGE.APPEAL_GRADE,
          data: sorted.map(e => e.ra!),
          borderColor: 'green',
          fill: false
        }
      ]
    };
  }

  prepareBarChart(): void {
    const sorted = [...this.contestedEntries];
    this.barChartData = {
      labels: sorted.map(e => e.name),
      datasets: [
        {
          label: Constants.EN_APPEALS_PAGE.GRADE_DIFFERENCE,
          data: sorted.map(e => parseFloat((e.ra! - e.ri!).toFixed(2))),
          backgroundColor: sorted.map(e => e.ra! - e.ri! >= 0 ? 'green' : 'red')
        }
      ]
    };
  }

  goBack(): void {
    this.router.navigate([`/${Constants.ROUTE_PATHS.HOME}`]);
  }
}
