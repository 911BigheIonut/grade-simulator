import { Component } from '@angular/core';
import { CandidateService } from '../../services/candidate.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-last-admitted',
  templateUrl: './last-admitted.component.html',
  styleUrls: ['./last-admitted.component.css'],
})
export class LastAdmittedComponent {
  years: string[] = ['2024', '2025'];
  counties = this.candidateService.counties;
  county: string = '';
  schools: string[] = [];
  school: string = '';

  data: { year: string; grade: number }[] = [];
  chartData: any;

  constructor(
    private candidateService: CandidateService,
    private location: Location
  ) {}

  async onCountyChange() {
    this.school = '';
    this.schools = [];
    this.data = [];
    this.chartData = null;

    if (this.county) {
      this.schools = await this.candidateService.getSchools('2024', this.county);
    }
  }

  async onSchoolChange() {
    if (!this.county || !this.school) return;

    this.data = [];

    for (const year of this.years) {
      await this.candidateService.loadCandidates(year, this.county);
      const candidates = this.candidateService
        .getAllCandidates()
        .filter((c) => c.school === this.school);

      if (candidates.length > 0) {
        const last = candidates.sort((a, b) => a.madm - b.madm)[0];
        this.data.push({ year, grade: last.madm });
      }
    }

    this.updateChart();
  }

  updateChart() {
    this.chartData = {
      labels: this.data.map((d) => d.year),
      datasets: [
        {
          label: 'Ultima medie admisă',
          data: this.data.map((d) => d.grade),
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.3)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }

  goBack() {
    this.location.back();
  }
}
