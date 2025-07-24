import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Router } from "@angular/router";
import { Constants } from '../../utils/constants';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface Student {
  grade: number;
  unit: string;
  specialization: string;
}

@Component({
  selector: 'app-bac-stats',
  templateUrl: './bac-stats.component.html',
  styleUrls: ['./bac-stats.component.css']
})
export class BacStatsComponent implements OnInit {
  protected readonly Constants = Constants;

  students: Student[] = [];
  filteredStudents: Student[] = []

  units: string[] = [];
  specializations: string[] = [];

  selectedUnit: string = Constants.DEFAULT_FILTERING;
  selectedSpecialization: string = Constants.DEFAULT_FILTERING;

  public chartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  public chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: Constants.BAC_PAGE.CHART_TITLE,
        font: {
          size: 12
        }
      },
      datalabels: {
        color: '#000',
        font: {
          weight: 'bold'
        },
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          if (total === 0) return '';

          const percent = ((value / total) * 100).toFixed(1);
          return `${value} (${percent}%)`;
        }
      }
    }
  };

  public ChartDataLabels = ChartDataLabels;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>(Constants.DATA_API_BASE_URL).subscribe(data => {
      const dataRows = data.slice(1);
      this.students = [];

      for (const s of dataRows) {
        const rawGrade = parseFloat(s[16]);
        const isValid = !isNaN(rawGrade) && rawGrade > 0

        if (isValid) {
          this.students.push({
            grade: rawGrade,
            unit: s[2],
            specialization: s[5]
          });
        }
      }

      this.units = [Constants.DEFAULT_FILTERING, ...Array.from(new Set(this.students.map(s => s.unit)))];
      this.specializations = [Constants.DEFAULT_FILTERING, ...Array.from(new Set(this.students.map(s => s.specialization)))];
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredStudents = this.students.filter(s =>
      (this.selectedUnit === Constants.DEFAULT_FILTERING || s.unit === this.selectedUnit) &&
      (this.selectedSpecialization === Constants.DEFAULT_FILTERING || s.specialization === this.selectedSpecialization)
    );
    this.updateChart();
  }

  get totalStudents(): number {
    return this.filteredStudents.length;
  }

  get averageGrade(): string {
    const avg = this.filteredStudents.reduce((sum, s) => sum + s.grade, 0) / this.totalStudents;
    return isNaN(avg) ? '-' : avg.toFixed(2);
  }

  getGradeIntervalCounts(): { label: string, color: string, count: number }[] {
    return Constants.GRADE_INTERVALS.map(interval => ({
      label: interval.label,
      color: interval.color,
      count: this.filteredStudents.filter(s => interval.match(s.grade)).length
    }));
  }

  updateChart(): void {
    const counts = this.getGradeIntervalCounts();

    this.chartData = {
      labels: counts.map(c => c.label),
      datasets: [
        {
          data: counts.map(c => c.count),
          backgroundColor: counts.map(c => c.color)
        }
      ]
    };
  }

  goBack(): void {
    this.router.navigate([`/${Constants.ROUTE_PATHS.HOME}`]);
  }

}
