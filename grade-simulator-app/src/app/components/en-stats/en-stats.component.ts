import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Candidate {
  madm: number;
  mabs: number;
  h: string;
  sp: string;
  n: string;
  nro: number;
  nmate: number;
}

@Component({
  selector: 'app-en-stats',
  templateUrl: './en-stats.component.html',
  styleUrls: ['./en-stats.component.css'],
})
export class EnStatsComponent implements OnInit {
  year: string = '2024';
  average: number | null = null;
  absAverage: number | null = null;
  candidatesData: Candidate[] = [];
  infoMessage: string = '';
  finalResults: {
    liceu: string;
    specializare: string;
    prima: Candidate;
    ultima: Candidate;
    pozMax: number;
    pozMin: number;
  }[] = [];
  stats: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCandidates();
  }

  loadCandidates() {
    const fileName = `assets/data/candidates${this.year}.json`;
    this.infoMessage = 'Se încarcă datele...';
    this.finalResults = [];

    this.http.get<any[]>(fileName).subscribe({
      next: (data) => {
        this.candidatesData = data.map((e) => ({
          madm: parseFloat(e.madm),
          mabs: parseFloat(e.mabs),
          nro: parseFloat(e.nro),
          nmate: parseFloat(e.nmate),
          h: e.h,
          sp: e.sp,
          n: e.n,
        }));

        const mediiAdmitere = this.candidatesData
          .map((e) => e.madm)
          .filter(Number.isFinite);
        const mediiMate = this.candidatesData
          .map((e) => e.nmate)
          .filter(Number.isFinite);
        const mediiRom = this.candidatesData
          .map((e) => e.nro)
          .filter(Number.isFinite);
        const mediiGen = this.candidatesData
          .map((e) => e.mabs)
          .filter(Number.isFinite);

        this.stats = {
          total: mediiAdmitere.length,
          mediaGenerala: this.avg(mediiAdmitere),
          mediaRom: this.avg(mediiRom),
          mediaMate: this.avg(mediiMate),
          mediaAbs: this.avg(mediiGen),
        };

        this.infoMessage =
          'Datele au fost încărcate. Introdu o medie și apasă "Caută".';
      },
      error: () => {
        this.infoMessage = 'Eroare la încărcarea datelor.';
      },
    });
  }

  avg(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  filterSchools() {
    const input = this.average;
    const inputAbs = this.absAverage === null ? 10.0 : this.absAverage;

    this.finalResults = [];

    if (input === null || input < 1 || input > 10) {
      this.infoMessage = 'Te rugăm să introduci o medie validă (1-10).';
      return;
    }

    if (inputAbs < 1 || inputAbs > 10) {
      this.infoMessage =
        'Te rugăm să introduci o medie de absolvire validă (1-10) sau să o lași necompletată.';
      return;
    }

    const sorted = this.candidatesData
      .filter((e) => !isNaN(e.madm) && !isNaN(e.mabs))
      .sort((a, b) => b.madm - a.madm || b.mabs - a.mabs);

    const pozitie =
      sorted.findIndex(
        (e) => input > e.madm || (input === e.madm && inputAbs >= e.mabs)
      ) + 1;

    const grouped: Record<
      string,
      { h: string; sp: string; entries: Candidate[] }
    > = {};
    for (const entry of sorted) {
      const key = `${entry.h}|${entry.sp}`;
      if (!grouped[key]) {
        grouped[key] = { h: entry.h, sp: entry.sp, entries: [entry] };
      } else {
        grouped[key].entries.push(entry);
      }
    }

    const resultArray = Object.values(grouped)
      .filter((group) => group.entries[group.entries.length - 1].madm <= input)
      .sort(
        (a, b) =>
          b.entries[b.entries.length - 1].madm -
          a.entries[a.entries.length - 1].madm
      );

    if (resultArray.length === 0) {
      this.infoMessage = 'Nu există licee unde te-ai încadra cu această medie.';
      return;
    }

    this.infoMessage = `Rezultate pentru media de admitere: ${input.toFixed(
      2
    )} | 
Media de absolvire: ${inputAbs.toFixed(2)} | 
Poziție estimativă: ${pozitie > 0 ? pozitie : 'sub ultima poziție'} | 
Total candidați: ${sorted.length}`;

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
  }
}
