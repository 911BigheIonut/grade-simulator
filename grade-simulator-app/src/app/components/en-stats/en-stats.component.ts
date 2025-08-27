import { Component, OnInit } from '@angular/core';
import { CandidateService, Candidate } from '../../services/candidate.service';

interface County {
  code: string;
  name: string;
}

@Component({
  selector: 'app-en-stats',
  templateUrl: './en-stats.component.html',
  styleUrls: ['./en-stats.component.css'],
})
export class EnStatsComponent implements OnInit {
  year: string = '2024';
  years: string[] = ['2022', '2023', '2024', '2025'];

  counties: County[] = this.candidateService.counties;
  selectedCounty: string = this.counties[0].code;

  average: number | null = null;
  absAverage: number | null = null;
  infoMessage: string = '';
  finalResults: any[] = [];
  stats: any = null;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedResults: any[] = [];

  constructor(private candidateService: CandidateService) {}

  async ngOnInit() {
    await this.loadCandidates();
  }

  async loadCandidates() {
    try {
      this.infoMessage = 'Se încarcă datele...';

      let fileIdentifier = this.year;
      if (this.year === '2024' || this.year === '2025') {
        fileIdentifier += this.selectedCounty;
      }

      await this.candidateService.loadCandidates(fileIdentifier);
      this.stats = this.candidateService.getStats();
      this.infoMessage =
        'Datele au fost încărcate. Introdu o medie și apasă "Caută".';
      this.resetPagination();
    } catch {
      this.infoMessage = 'Eroare la încărcarea datelor.';
    }
  }

  filterSchools() {
    if (this.average === null || this.average < 1 || this.average > 10) {
      this.infoMessage = 'Te rugăm să introduci o medie validă (1-10).';
      return;
    }
    if (
      this.absAverage !== null &&
      (this.absAverage < 1 || this.absAverage > 10)
    ) {
      this.infoMessage =
        'Te rugăm să introduci o medie de absolvire validă (1-10) sau să o lași necompletată.';
      return;
    }

    const { resultArray, sorted, pozitie } =
      this.candidateService.filterCandidates(this.average, this.absAverage);

    if (resultArray.length === 0) {
      this.infoMessage = 'Nu există licee unde te-ai încadra cu această medie.';
      this.finalResults = [];
      this.paginatedResults = [];
      return;
    }

    this.infoMessage = `Rezultate pentru media de admitere: ${this.average.toFixed(
      2
    )} | Media de absolvire: ${(this.absAverage ?? 10).toFixed(
      2
    )} | Poziție estimativă: ${
      pozitie > 0 ? pozitie : 'sub ultima poziție'
    } | Total candidați: ${sorted.length}`;

    this.finalResults = resultArray.map((group) => {
      const prima = group.entries[0];
      const ultima = group.entries[group.entries.length - 1];

      const pozMax =
        sorted.findIndex(
          (e) =>
            e.madm === prima.madm &&
            e.mabs === prima.mabs &&
            e.h === group.h &&
            e.sp === group.sp
        ) + 1;
      const pozMin =
        sorted.findIndex(
          (e) =>
            e.madm === ultima.madm &&
            e.mabs === ultima.mabs &&
            e.h === group.h &&
            e.sp === group.sp
        ) + 1;

      return {
        liceu: group.h,
        specializare: group.sp,
        prima,
        ultima,
        pozMax,
        pozMin,
      };
    });

    this.resetPagination();
  }

  resetPagination() {
    this.currentPage = 1;
    this.updatePaginatedResults();
  }

  updatePaginatedResults() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedResults = this.finalResults.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedResults();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedResults();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedResults();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.finalResults.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goBack(): void {
    window.history.back();
  }
}
