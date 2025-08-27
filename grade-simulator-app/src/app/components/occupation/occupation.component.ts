import { Component, OnInit } from '@angular/core';
import { CandidateService, Candidate } from '../../services/candidate.service';

@Component({
  selector: 'app-degree-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.css']
})
export class DegreeOccupationComponent implements OnInit {
  candidates: Candidate[] = [];
  position: number = 1;
  specializations: { name: string; count: number; proportion: number }[] = [];
  year: string = '2024';

  constructor(private candidateService: CandidateService) {}

  async ngOnInit() {
    await this.candidateService.loadCandidates(this.year);
    this.candidates = this.candidateService.getAllCandidates();

    this.onPositionChange();
  }

  onPositionChange() {
    if (!this.candidates || this.candidates.length === 0) return;

    const sorted = [...this.candidates].sort((a, b) => b.madm - a.madm);

    const taken = sorted.slice(0, this.position);

    const counts: Record<string, number> = {};
    for (const c of taken) {
      const sp = c.sp && c.sp !== 'Nespecificat' ? c.sp : '—';
      counts[sp] = (counts[sp] || 0) + 1;
    }

    const total = taken.length || 1;
    this.specializations = Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        proportion: (count / total) * 100
      }))
      .sort((a, b) => b.proportion - a.proportion);
  }
}
