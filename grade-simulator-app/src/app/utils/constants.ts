export const Constants = {
  APP_TITLES: {
    HOME: 'Simulare Repartizare Licee',
    BAC: 'Bacalaureat 2025 Brașov',
    EN: 'Simulare Admitere Liceu'
  },

  ROUTE_PATHS: {
    HOME: 'simulare-evaluare2025',
    REPARTIZARE: 'simulare-evaluare2025/repartizare',
    BAC: 'simulare-evaluare2025/bac'
  },

  GRADE_INTERVALS: [
    { label: 'Neprezentat', color: '#600', match: (m: number) => m === 0 },
    { label: 'Respins', color: '#f28e8e', match: (m: number) => m > 0 && m < 6 },
    { label: '6–7', color: '#f4e77d', match: (m: number) => m >= 6 && m < 7 },
    { label: '7–8', color: '#d5e873', match: (m: number) => m >= 7 && m < 8 },
    { label: '8–9', color: '#75cf75', match: (m: number) => m >= 8 && m < 9 },
    { label: '9–10', color: '#185c2e', match: (m: number) => m >= 9 }
  ],

  DATA_API_BASE_URL: 'https://ionutb.github.io/simulare-evaluare2025/data.json',
  HOME_PAGE: {
    TITLE: 'Simulare Repartizare Licee',
    EN_OPTION_TITLE: 'Repartizare Licee',
    EN_OPTION_SUBTITLE: 'Simulează repartizarea elevilor în liceele din Brașov.',
    BAC_OPTION_TITLE: 'Statistici Bac 2025',
    BAC_OPTION_SUBTITLE: 'Explorează datele și graficele examenului de Bacalaureat 2025.'
  },
  BAC_PAGE: {
    TITLE: 'Bacalaureat 2025 Brașov',
    UNIT: 'Unitate:',
    SPECIALIZATION: 'Specializare:',
    TOTAL_STUDENTS: 'Total elevi selectați:',
    AVERAGE_GRADE: 'Media generală:',
    CHART_TITLE: 'Distribuția mediilor pe intervale',
    NO_RESULTS_ERROR_MESSAGE: 'Nu există date pentru filtrarea selectată.'
  },
  DEFAULT_FILTERING: 'Toate',
  BACK_BUTTON: 'Înapoi',
};
