import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CandidateService, County } from 'src/app/services/candidate.service';

@Component({
  selector: 'app-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.css'],
})
export class OccupationComponent implements OnInit {
  years = [2024, 2025];
  counties: County[] = [];

  year: number = 2024;
  county: string = '';
  position: number = 500;

  candidates: any[] = [];

  complete: any[] = [];
  partial: any[] = [];
  empty: any[] = [];

  constructor(
    private http: HttpClient,
    private candidateService: CandidateService
  ) {}

  ngOnInit() {
    this.counties = this.candidateService.counties;
    if (this.counties.length > 0) {
      this.county = this.counties[0].code;
    }
    this.loadData();
  }

  loadData() {
    if (!this.year || !this.county) return;

    const filePath = `assets/data/candidate${this.year}${this.county}.json`;

    this.http.get<any[]>(filePath).subscribe({
      next: (data) => {
        this.candidates = data.sort(
          (a, b) => parseFloat(b.madm) - parseFloat(a.madm)
        );
        this.analyze();
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.candidates = [];
        this.complete = [];
        this.partial = [];
        this.empty = [];
      },
    });
  }

  analyze() {
    if (!this.position || this.position <= 0 || !this.candidates.length) return;

    const groups: { [key: string]: { pos: number; avg: number }[] } = {};

    this.candidates.forEach((c, idx) => {
      const key = c.h || c.school || 'N/A';
      if (!groups[key]) groups[key] = [];
      groups[key].push({ pos: idx + 1, avg: parseFloat(c.madm) });
    });

    this.complete = [];
    this.partial = [];
    this.empty = [];

    for (const liceu in groups) {
      const positions = groups[liceu];
      const capacity = positions.length;
      const posNums = positions.map((p) => p.pos);
      const first = Math.min(...posNums);
      const last = Math.max(...posNums);

      const occupied = positions.filter((p) => p.pos < this.position).length;
      const free = capacity - occupied;
      const percent = ((occupied / capacity) * 100).toFixed(2) + '%';
      const lastAvg =
        positions.find((p) => p.pos === last)?.avg.toFixed(2) ?? '-';

      const row = [
        liceu,
        `${first} - ${last}`,
        occupied,
        free,
        percent,
        lastAvg,
      ];

      if (occupied === capacity) {
        this.complete.push(row);
      } else if (occupied > 0) {
        this.partial.push(row);
      } else {
        this.empty.push(row);
      }
    }

    this.complete.sort((a, b) => parseFloat(b[5]) - parseFloat(a[5]));
    this.partial.sort((a, b) => parseFloat(b[5]) - parseFloat(a[5]));
    this.empty.sort((a, b) => parseFloat(b[5]) - parseFloat(a[5]));
  }
}
