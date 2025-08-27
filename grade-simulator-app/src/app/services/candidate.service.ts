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
  position?: number;
}

export interface County {
  name: string;
  code: string;
}

export interface LastAdmitted {
  group: string;
  lastPosition: number;
  year: string;
}

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private candidatesData: Candidate[] = [];

  constructor(private http: HttpClient) {}

  counties: County[] = [
    { name: 'Alba', code: 'AB' },
    { name: 'Arad', code: 'AR' },
    { name: 'Argeş', code: 'AG' },
    { name: 'Bacău', code: 'BC' },
    { name: 'Bihor', code: 'BH' },
    { name: 'Bistriţa-Năsăud', code: 'BN' },
    { name: 'Botoşani', code: 'BT' },
    { name: 'Brăila', code: 'BR' },
    { name: 'Braşov', code: 'BV' },
    { name: 'Buzău', code: 'BZ' },
    { name: 'Călăraşi', code: 'CL' },
    { name: 'Caraş-Severin', code: 'CS' },
    { name: 'Cluj', code: 'CJ' },
    { name: 'Constanţa', code: 'CT' },
    { name: 'Covasna', code: 'CV' },
    { name: 'Dâmboviţa', code: 'DB' },
    { name: 'Dolj', code: 'DJ' },
    { name: 'Galaţi', code: 'GL' },
    { name: 'Giurgiu', code: 'GR' },
    { name: 'Gorj', code: 'GJ' },
    { name: 'Harghita', code: 'HR' },
    { name: 'Hunedoara', code: 'HD' },
    { name: 'Ialomiţa', code: 'IL' },
    { name: 'Iaşi', code: 'IS' },
    { name: 'Ilfov', code: 'IF' },
    { name: 'Maramureş', code: 'MM' },
    { name: 'Mehedinţi', code: 'MH' },
    { name: 'Mureş', code: 'MS' },
    { name: 'Neamţ', code: 'NT' },
    { name: 'Olt', code: 'OT' },
    { name: 'Prahova', code: 'PH' },
    { name: 'Sălaj', code: 'SJ' },
    { name: 'Satu Mare', code: 'SM' },
    { name: 'Sibiu', code: 'SB' },
    { name: 'Suceava', code: 'SV' },
    { name: 'Teleorman', code: 'TR' },
    { name: 'Timiş', code: 'TM' },
    { name: 'Tulcea', code: 'TL' },
    { name: 'Vâlcea', code: 'VL' },
    { name: 'Vaslui', code: 'VS' },
    { name: 'Vrancea', code: 'VN' },
    { name: 'Bucureşti', code: 'B' },
  ];

  async loadCandidates(year: string, countyCode?: string): Promise<void> {
    const fileName = countyCode
      ? `assets/data/candidate${year}${countyCode}.json`
      : `assets/data/candidate${year}.json`;
    const data: any[] = await firstValueFrom(this.http.get<any[]>(fileName));

    this.candidatesData = data
      .map((e: any) => {
        const is2022or2023 = 's' in e;
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
        (c: Candidate) =>
          !isNaN(c.madm) &&
          !isNaN(c.mabs) &&
          c.madm >= 1 &&
          c.madm <= 10 &&
          c.mabs >= 1 &&
          c.mabs <= 10
      );
  }

  getCounties(): string[] {
    return this.counties.map((c) => c.code);
  }

  async getSchools(year: string, countyCode?: string): Promise<string[]> {
    if (countyCode) await this.loadCandidates(year, countyCode);
    else await this.loadCandidates(year);
    const schools = Array.from(new Set(this.candidatesData.map((c) => c.school).filter(Boolean)));
    return schools;
  }

  async getLastAdmitted(
    school: string,
    specializare: string,
    countyCode?: string
  ): Promise<LastAdmitted[]> {
    const years = ['2022', '2023', '2024', '2025'];
    const results: LastAdmitted[] = [];

    for (const year of years) {
      if (countyCode) await this.loadCandidates(year, countyCode);
      else await this.loadCandidates(year);

      const filtered = this.candidatesData.filter(
        (c) => c.school === school && c.sp === specializare
      );

      if (!filtered.length) continue;

      const sorted = filtered.sort((a, b) => b.madm - a.madm || b.mabs - a.mabs);
      const last = sorted[0];
      results.push({
        group: `${school} - ${specializare}`,
        lastPosition: last.madm,
        year,
      });
    }
    return results;
  }

  getStats() {
    const mediiAdmitere = this.candidatesData.map((e) => e.madm);
    const mediiMate = this.candidatesData.map((e) => e.nmate).filter(Number.isFinite);
    const mediiRom = this.candidatesData.map((e) => e.nro).filter(Number.isFinite);
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

    const grouped: Record<string, { h: string; sp: string; entries: Candidate[] }> = {};
    for (const entry of sorted) {
      const displayH = entry.h ?? '';
      const displaySp = entry.sp ?? '';
      const key = `${displayH}|${displaySp}`;
      if (!grouped[key]) grouped[key] = { h: displayH, sp: displaySp, entries: [entry] };
      else grouped[key].entries.push(entry);
    }

    const resultArray = Object.values(grouped)
      .filter((group) => group.entries[group.entries.length - 1].madm <= average)
      .sort(
        (a, b) =>
          b.entries[b.entries.length - 1].madm -
          a.entries[a.entries.length - 1].madm
      );

    return { resultArray, sorted, pozitie };
  }

  getAllCandidates(): Candidate[] {
    return this.candidatesData;
  }

  private avg(values: number[]): number {
    const valid = values.filter(Number.isFinite);
    return valid.length > 0
      ? valid.reduce((a, b) => a + b, 0) / valid.length
      : 0;
  }
}
