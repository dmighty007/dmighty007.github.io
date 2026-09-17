export interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
  detail?: string;
  category: 'conference' | 'academic';
}

export const awards: Award[] = [
  {
    id: 'cdam-2026-poster',
    title: 'Poster Award',
    issuer: 'Computational and Data-Driven Advanced Materials (CDAM 2026), CSIR–CGCRI, Kolkata',
    year: '2026',
    category: 'conference',
  },
  {
    id: 'md60-best-poster',
    title: 'Best Poster Award',
    issuer: 'JNCASR–CECAM Conference: MD@60, Bengaluru',
    year: '2024',
    category: 'conference',
  },
  {
    id: 'rac-tca-best-poster',
    title: 'Best Poster Award',
    issuer: 'National Conference on Recent Advances in Chemistry: Theoretical and Computational Aspects (RAC-TCA 2022), NIT Meghalaya',
    year: '2022',
    category: 'conference',
  },
  {
    id: 'inspire',
    title: 'INSPIRE Scholarship for Higher Education (SHE)',
    issuer: 'Department of Science and Technology, Government of India',
    year: '2016–2019',
    detail: 'Top 1% of the WBCHSE board examination.',
    category: 'academic',
  },
  {
    id: 'gate',
    title: 'GATE 2021 — Physics',
    issuer: 'Graduate Aptitude Test in Engineering',
    year: '2021',
    detail: 'All India Rank 177.',
    category: 'academic',
  },
  {
    id: 'ngpe',
    title: 'National Graduate Physics Examination (NGPE)',
    issuer: 'Indian Association of Physics Teachers (IAPT)',
    year: '2019',
    detail: 'National top 26 students.',
    category: 'academic',
  },
  {
    id: 'jest',
    title: 'JEST 2019 — Physics',
    issuer: 'Joint Entrance Screening Test',
    year: '2019',
    detail: 'All India Rank 191.',
    category: 'academic',
  },
  {
    id: 'iit-jam',
    title: 'IIT JAM 2019 — Physics',
    issuer: 'Joint Admission Test for M.Sc., Indian Institutes of Technology',
    year: '2019',
    detail: 'All India Rank 898.',
    category: 'academic',
  },
];
