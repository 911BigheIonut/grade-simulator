import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Candidate {
  county: string;
  name: string;
  school: string;
  schoolCode?: string;
  madm: number;
  mev: number;
  mabs: number;
  nro: number;
  nmate: number;
  h?: string;
  sp?: string;
  year?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private candidatesData: Candidate[] = [];

  constructor(private http: HttpClient) {}

  async loadCandidates(year: string): Promise<void> {
    const fileName = `assets/data/candidate${year}.json`;
    const data: any[] = await firstValueFrom(this.http.get<any[]>(fileName));

    this.candidatesData = data
      .map((e: any) => {
        const is2022or2023 = 's' in e;
        const is2024or2025 = 'school' in e;

        const parseScore = (val: any, fallback?: any): number => {
          const num = parseFloat(val ?? fallback ?? 'NaN');
          return isFinite(num) && num >= 1 && num <= 10 ? num : NaN;
        };

        return {
          county: e.ja || e.county || '',
          name: e.n || e.name || '',
          school: is2022or2023 ? e.s : e.school || '',
          schoolCode: e.sc || e.schoolCode || undefined,
          madm: parseScore(e.madm, e.mev),
          mev: parseScore(e.mev, e.madm),
          mabs: parseScore(e.mabs, '10'),
          nro: parseScore(e.nro, e.ri),
          nmate: parseScore(e.nmate, e.mi),
          h: is2022or2023
            ? e.h || ''
            : `<b>${e.school}</b><br/>${
                e.sp && e.sp !== 'Nespecificat' ? e.sp : ''
              }`,
          sp: e.sp && e.sp !== 'Nespecificat' ? e.sp : '',
          year,
        };
      })
      .filter(
        (c) =>
          !isNaN(c.madm) &&
          !isNaN(c.mabs) &&
          c.madm >= 1 &&
          c.madm <= 10 &&
          c.mabs >= 1 &&
          c.mabs <= 10
      );
  }

  getStats() {
    const mediiAdmitere = this.candidatesData.map((e) => e.madm);
    const mediiMate = this.candidatesData
      .map((e) => e.nmate)
      .filter(Number.isFinite);
    const mediiRom = this.candidatesData
      .map((e) => e.nro)
      .filter(Number.isFinite);
    const mediiGen = this.candidatesData.map((e) => e.mabs);

    return {
      total: mediiAdmitere.length,
      mediaGenerala: this.avg(mediiAdmitere),
      mediaRom: this.avg(mediiRom),
      mediaMate: this.avg(mediiMate),
      mediaAbs: this.avg(mediiGen),
    };
  }

  filterCandidates(average: number, absAverage: number | null) {
    const inputAbs = absAverage === null ? 10.0 : absAverage;

    const sorted = this.candidatesData
      .filter((e) => e.madm >= 1 && e.madm <= 10 && e.mabs >= 1 && e.mabs <= 10)
      .sort((a, b) => b.madm - a.madm || b.mabs - a.mabs);

    const pozitie =
      sorted.findIndex(
        (e) => average > e.madm || (average === e.madm && inputAbs >= e.mabs)
      ) + 1;

    const grouped: Record<
      string,
      { h: string; sp: string; entries: Candidate[] }
    > = {};

    for (const entry of sorted) {
      const is2024or2025 = entry.year === '2024' || entry.year === '2025';
      const displayH = is2024or2025
        ? `<b>${entry.school}</b>`
        : entry.h ?? '';

      const displaySp = entry.sp ?? '';
      const key = `${displayH}|${displaySp}`;

      if (!grouped[key]) {
        grouped[key] = { h: displayH, sp: displaySp, entries: [entry] };
      } else {
        grouped[key].entries.push(entry);
      }
    }

    const resultArray = Object.values(grouped)
      .filter(
        (group) => group.entries[group.entries.length - 1].madm <= average
      )
      .sort(
        (a, b) =>
          b.entries[b.entries.length - 1].madm -
          a.entries[a.entries.length - 1].madm
      );

    return { resultArray, sorted, pozitie };
  }

  private avg(values: number[]): number {
    const valid = values.filter(Number.isFinite);
    return valid.length > 0
      ? valid.reduce((a, b) => a + b, 0) / valid.length
      : 0;
  }
}
