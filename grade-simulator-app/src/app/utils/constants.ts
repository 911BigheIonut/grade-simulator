export const Constants = {
  APP_TITLES: {
    HOME: 'Simulare Repartizare Licee',
    BAC: 'Bacalaureat 2025 Brașov',
    EN: 'Simulare Admitere Liceu',
    EN_APPEALS: 'Analiză contestații Română'
  },

  ROUTE_PATHS: {
    HOME: 'simulare-evaluare2025',
    REPARTIZARE: 'simulare-evaluare2025/repartizare',
    BAC: 'simulare-evaluare2025/bac',
    EN_APPEALS: 'simulare-evaluare2025/contestatii'
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
  DATA_API_BASE_EN_APPEALS_URL: 'https://ionutb.github.io/simulare-evaluare2025/note.json',
  HOME_PAGE: {
    TITLE: 'Simulare Repartizare Licee',
    EN_OPTION_TITLE: 'Repartizare Licee',
    EN_OPTION_SUBTITLE: 'Simulează repartizarea elevilor în liceele din Brașov.',
    EN_APPEALS_OPTION_TITLE: 'Analiză contestații la Limba Română',
    EN_APPEALS_OPTION_SUBTITLE: 'Evaluare Națională',
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
  EN_APPEALS_PAGE: {
    TITLE: '📊 Analiză contestații la română',
    TOTAL_APPEALS: 'Total contestații:',
    TOTAL_HIGHER_GRADES: 'Note crescute:',
    TOTAL_LOWER_GRADES: 'Note scăzute:',
    TOTAL_UNMODIFIED_GRADES: 'Fără modificare:',
    AVERAGE_GRADE_DIFFERENCE: 'Diferență medie:',
    GRADE_EVOLUTION_CHART_TITLE: 'Evoluția notelor la română (ri vs ra)',
    GRADE_DIFFERENCE_CHART_TITLE: 'Deviația față de nota inițială (ra - ri)',
    INITIAL_GRADE: 'Nota inițială (ri)',
    APPEAL_GRADE: 'Nota după contestație (ra)',
    GRADE_DIFFERENCE: 'Diferență (ra - ri)'
  },
  DEFAULT_FILTERING: 'Toate',
  BACK_BUTTON: 'Înapoi',
};
