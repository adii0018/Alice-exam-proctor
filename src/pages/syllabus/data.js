// ── Alice Syllabus Data ─────────────────────────────────────────────────────
// Data yahan update karein. Future mein Django API se replace hoga.

// Color cycling array - Alice dark theme accents
export const BLOCK_COLORS = [
  { bg: 'rgba(63,185,80,0.1)',   border: 'rgba(63,185,80,0.4)',   accent: '#3fb950' },
  { bg: 'rgba(121,192,255,0.1)', border: 'rgba(121,192,255,0.4)', accent: '#79c0ff' },
  { bg: 'rgba(210,153,34,0.1)',  border: 'rgba(210,153,34,0.4)',  accent: '#e3b341' },
  { bg: 'rgba(248,81,73,0.1)',   border: 'rgba(248,81,73,0.4)',   accent: '#f85149' },
  { bg: 'rgba(163,113,247,0.1)', border: 'rgba(163,113,247,0.4)', accent: '#a371f7' },
]

export const syllabusData = {

  // ══════════════════════════════════════════════
  //  FIRST YEAR
  // ══════════════════════════════════════════════
  'first-year': {
    label: 'First Year',
    semesters: {
      1: {
        label: 'Semester 1',
        subjects: [
          { id: 'bt101', name: 'BT-101 - Engineering Chemistry', units: [
            { unit: 1, title: 'Water – Analysis, Treatments and Industrial Applications', content: 'Sources, Impurities, Hardness & its units, Determination of hardness by EDTA method, Alkalinity & Its determination and related numerical problems.' },
            { unit: 2, title: 'Boiler Problem & Softening Methods', content: 'Boiler troubles (Sludge & Scale, Priming & Foaming, Boiler Corrosion, Caustic Embrittlement), Softening methods (Lime-Soda, Zeolite and Ion Exchange Methods) and related numerical problems.' },
            { unit: 3, title: 'Lubricants and Lubrication', content: 'Introduction, Mechanism of lubrication, Classification of lubricants, significance & determination of Viscosity and Viscosity Index, Flash & Fire Points, Cloud & Pour Points, Aniline Point, Acid Number, Saponification Number, Steam Emulsification Number and related numerical problems.' },
            { unit: 4, title: 'Polymer & Polymerization', content: 'Introduction, types of polymerisation, Classification, mechanism of polymerisation (Free radical & Ionic polymerization). Thermoplastic & Thermosetting polymers. Elementary idea of Biodegradable polymers, preparation, properties & uses of the following polymers: PVC, PMMA, Teflon, Nylon 6, Nylon 6:6, Polyester, Phenol Formaldehyde, Urea-Formaldehyde, Buna N, Buna S, Vulcanization of Rubber.' },
            { unit: 5, title: 'Phase Equilibrium and Corrosion', content: 'Phase diagram of single component system (Water). Phase diagram of binary Eutectic System (Cu-Ag). Corrosion: Types, Mechanisms & Prevention.' },
            { unit: 6, title: 'Spectroscopic Techniques and Application', content: 'Principle, Instrumentation & Applications, Electronics Spectroscopy, Vibrational & Rotational Spectroscopy of diatomic molecules.' },
            { unit: 7, title: 'Periodic Properties', content: 'Effective Nuclear Charge, Variations: S, P, d & f Orbital energies of atoms in periodic table, Electronics Configuration, Atomic & Ionic sizes, Electron Affinity & Electronegativity, Polarizability & Oxidation States.' },
          ] },
          { id: 'bt102', name: 'BT-102 - Mathematics-I', units: [
            { unit: 1, title: 'Calculus – Differentiation', content: 'Rolle\'s theorem, Mean Value theorems, Expansion of functions by McLaurin\'s and Taylor\'s for one variable; Taylor\'s theorem for function of two variables, Partial Differentiation, Maxima & Minima (two and three variables), Method of Lagranges Multipliers. (10 hours)' },
            { unit: 2, title: 'Calculus – Integration', content: 'Definite Integral as a limit of a sum and its application in summation of series; Beta and Gamma functions and their properties; Applications of definite integrals to evaluate surface areas and volumes of revolutions. Multiple Integral, Change the order of the integration, Applications of multiple integral for calculating area and volumes of the curves. (8 hours)' },
            { unit: 3, title: 'Sequences and Series', content: 'Convergence of sequence and series, tests for convergence; Power series, Taylor\'s series, series for exponential, trigonometric and logarithm functions; Fourier series: Half range sine and cosine series, Parseval\'s theorem. (6 hours)' },
            { unit: 4, title: 'Vector Spaces', content: 'Vector Space, Vector Sub Space, Linear Combination of Vectors, Linearly Dependent, Linearly Independent, Basis of a Vector Space, Linear Transformations. (8 hours)' },
            { unit: 5, title: 'Matrices', content: 'Rank of a Matrix, Solution of Simultaneous Linear Equations by Elementary Transformation, Consistency of Equation, Eigen Values and Eigen Vectors, Diagonalization of Matrices, Cayley-Hamilton theorem and its applications to find inverse. (8 hours)' },
          ] },
          { id: 'bt103', name: 'BT-103 - English for Communication',                                                       units: [] },
          { id: 'bt104', name: 'BT-104 - Basic Electrical & Electronics Engineering',                                      units: [] },
          { id: 'bt105', name: 'BT-105 - Engineering Graphics',                                                            units: [] },
          { id: 'bt106', name: 'BT-106 - Manufacturing Practices',                                                         units: [] },
          { id: 'bt107', name: 'BT-107 - Internship-I (60 Hrs Duration) at the Institute level',                           units: [] },
          { id: 'bt108', name: 'BT-108 - Swachh Bharat Summer Internship / Unnat Bharat Abhiyan (100Hrs)/Rural Outreach',  units: [] },
        ],
      },
      2: {
        label: 'Semester 2',
        subjects: [
          { id: 'bt201', name: 'BT-201 - Engineering Physics',                  units: [] },
          { id: 'bt202', name: 'BT-202 - Mathematics-II',                        units: [] },
          { id: 'bt203', name: 'BT-203 - Basic Mechanical Engineering',          units: [] },
          { id: 'bt204', name: 'BT-204 - Basic Civil Engineering & Mechanics',   units: [] },
          { id: 'bt205', name: 'BT-205 - Basic Computer Engineering',            units: [] },
          { id: 'bt206', name: 'BT-206 - Language Lab & Seminars',               units: [] },
        ],
      },
    },
  },

  // ══════════════════════════════════════════════
  //  SECOND YEAR (Sem 3 & 4)
  // ══════════════════════════════════════════════
  'second-year': {
    label: 'Second Year',
    semesters: {
      3: {
        label: 'Semester 3',
        subjects: [
          { id: 'es301', name: 'ES-301 - Energy & Environmental Engineering',                                              units: [] },
          { id: 'cs302', name: 'CS-302 - Discrete Structure',                                                              units: [] },
          { id: 'cs303', name: 'CS-303 - Data Structure',                                                                  units: [] },
          { id: 'cs304', name: 'CS-304 - Digital Systems',                                                                 units: [] },
          { id: 'cs305', name: 'CS-305 - Object Oriented Programming & Methodology',                                       units: [] },
          { id: 'cs306', name: 'CS-306 - Computer Workshop',                                                               units: [] },
          { id: 'bt107e', name: 'BT-107 - Evaluation of Internship-I (completed at I year level)',                        units: [] },
          { id: 'bt307', name: 'BT-307 - 90 hrs Internship based on using various softwares – Internship-II',             units: [] },
        ],
      },
      4: {
        label: 'Semester 4',
        subjects: [
          { id: 'bt401',  name: 'BT-401 - Mathematics-III',                                                               units: [] },
          { id: 'cs402',  name: 'CS-402 - Analysis Design of Algorithm',                                                  units: [] },
          { id: 'cs403',  name: 'CS-403 - Software Engineering',                                                          units: [] },
          { id: 'cs404',  name: 'CS-404 - Computer Organisation & Architecture',                                          units: [] },
          { id: 'cs405',  name: 'CS-405 - Operating Systems',                                                             units: [] },
          // CS-406 Electives — student chooses one
          { id: 'cs406a', name: 'CS-406 - Programming Practices (Java)',                                                   units: [], isElective: true, electiveGroup: 'CS-406' },
          { id: 'cs406b', name: 'CS-406 - Programming Practices (.NET)',                                                   units: [], isElective: true, electiveGroup: 'CS-406' },
          { id: 'cs406c', name: 'CS-406 - Programming Practices (Python)',                                                 units: [], isElective: true, electiveGroup: 'CS-406' },
          { id: 'cs406d', name: 'CS-406 - Programming Practices (MATLAB)',                                                 units: [], isElective: true, electiveGroup: 'CS-406' },
          { id: 'bt407',  name: 'BT-407 - 90 hrs Internship based on using various softwares – Internship-II',           units: [] },
          { id: 'bt408',  name: 'BT-408 - Cyber Security',                                                                units: [] },
        ],
      },
    },
  },

  // ══════════════════════════════════════════════
  //  THIRD YEAR (Sem 5 & 6)
  // ══════════════════════════════════════════════
  'third-year': {
    label: 'Third Year',
    semesters: {
      5: {
        label: 'Semester 5',
        subjects: [
          { id: 'cs501',  name: 'CS-501 - Theory of Computation',                                                         units: [] },
          { id: 'cs502',  name: 'CS-502 - Database Management Systems',                                                   units: [] },
          // CS-503 Electives — student chooses one
          { id: 'cs503a', name: 'CS-503 - Data Analytics',                                                                units: [], isElective: true, electiveGroup: 'CS-503' },
          { id: 'cs503b', name: 'CS-503 - Pattern Recognition',                                                           units: [], isElective: true, electiveGroup: 'CS-503' },
          { id: 'cs503c', name: 'CS-503 - Cyber Security',                                                                units: [], isElective: true, electiveGroup: 'CS-503' },
          // CS-504 Electives — student chooses one
          { id: 'cs504a', name: 'CS-504 - Internet and Web Technology',                                                   units: [], isElective: true, electiveGroup: 'CS-504' },
          { id: 'cs504b', name: 'CS-504 - Object Oriented Programming',                                                   units: [], isElective: true, electiveGroup: 'CS-504' },
          { id: 'cs504c', name: 'CS-504 - Introduction to Database Management Systems',                                   units: [], isElective: true, electiveGroup: 'CS-504' },
          { id: 'cs505',  name: 'CS-505 - Lab (Linux)',                                                                   units: [] },
          { id: 'cs506',  name: 'CS-506 - Lab (Python)',                                                                  units: [] },
          { id: 'cs507',  name: 'CS-507 - Evaluation of Internship-II',                                                   units: [] },
          { id: 'cs508',  name: 'CS-508 - Minor Project-I',                                                               units: [] },
        ],
      },
      6: {
        label: 'Semester 6',
        subjects: [
          { id: 'cs601',  name: 'CS-601 - Machine Learning',                                                              units: [] },
          { id: 'cs602',  name: 'CS-602 - Computer Networks',                                                             units: [] },
          // CS-603 Electives — student chooses one
          { id: 'cs603a', name: 'CS-603 - Advanced Computer Architecture',                                                units: [], isElective: true, electiveGroup: 'CS-603' },
          { id: 'cs603b', name: 'CS-603 - Computer Graphics & Visualisation',                                             units: [], isElective: true, electiveGroup: 'CS-603' },
          { id: 'cs603c', name: 'CS-603 - Compiler Design',                                                               units: [], isElective: true, electiveGroup: 'CS-603' },
          // CS-604 Electives — student chooses one
          { id: 'cs604a', name: 'CS-604 - Knowledge Management',                                                          units: [], isElective: true, electiveGroup: 'CS-604' },
          { id: 'cs604b', name: 'CS-604 - Project Management',                                                            units: [], isElective: true, electiveGroup: 'CS-604' },
          { id: 'cs604c', name: 'CS-604 - Rural Technology & Community Development',                                      units: [], isElective: true, electiveGroup: 'CS-604' },
        ],
      },
    },
  },

  // ══════════════════════════════════════════════
  //  FOURTH YEAR (Sem 7 & 8)
  // ══════════════════════════════════════════════
  'fourth-year': {
    label: 'Fourth Year',
    semesters: {
      7: {
        label: 'Semester 7',
        subjects: [
          { id: 'cs701',  name: 'CS-701 - Software Architectures',                                                        units: [] },
          // CS-702 Departmental Electives — student chooses one
          { id: 'cs702a', name: 'CS-702(A) - Computational Intelligence',                                                 units: [], isElective: true, electiveGroup: 'CS-702 Departmental' },
          { id: 'cs702b', name: 'CS-702(B) - Deep & Reinforcement Learning',                                              units: [], isElective: true, electiveGroup: 'CS-702 Departmental' },
          { id: 'cs702c', name: 'CS-702(C) - Wireless & Mobile Computing',                                                units: [], isElective: true, electiveGroup: 'CS-702 Departmental' },
          { id: 'cs702d', name: 'CS-702(D) - Big Data',                                                                   units: [], isElective: true, electiveGroup: 'CS-702 Departmental' },
          // CS-703 Open Electives — student chooses one
          { id: 'cs703a', name: 'CS-703(A) - Cryptography & Information Security',                                        units: [], isElective: true, electiveGroup: 'CS-703 Open' },
          { id: 'cs703b', name: 'CS-703(B) - Data Mining and Warehousing',                                                units: [], isElective: true, electiveGroup: 'CS-703 Open' },
          { id: 'cs703c', name: 'CS-703(C) - Agile Software Development',                                                 units: [], isElective: true, electiveGroup: 'CS-703 Open' },
          { id: 'cs703d', name: 'CS-703(D) - Disaster Management',                                                        units: [], isElective: true, electiveGroup: 'CS-703 Open' },
          { id: 'cs7sem', name: 'Seminar / Internship / Project Work',                                                    units: [] },
        ],
      },
      8: {
        label: 'Semester 8',
        subjects: [
          { id: 'cs801',  name: 'CS-801 - Internet of Things (IoT)',                                                      units: [] },
          // CS-802 Departmental Electives — student chooses one
          { id: 'cs802a', name: 'CS-802(A) - Blockchain Technologies',                                                    units: [], isElective: true, electiveGroup: 'CS-802 Departmental' },
          { id: 'cs802b', name: 'CS-802(B) - Cloud Computing',                                                            units: [], isElective: true, electiveGroup: 'CS-802 Departmental' },
          { id: 'cs802c', name: 'CS-802(C) - High Performance Computing',                                                 units: [], isElective: true, electiveGroup: 'CS-802 Departmental' },
          { id: 'cs802d', name: 'CS-802(D) - Object-Oriented Software Engineering',                                       units: [], isElective: true, electiveGroup: 'CS-802 Departmental' },
          // CS-803 Open Electives — student chooses one
          { id: 'cs803a', name: 'CS-803(A) - Image Processing & Computer Vision',                                         units: [], isElective: true, electiveGroup: 'CS-803 Open' },
          { id: 'cs803b', name: 'CS-803(B) - Cyber Security',                                                             units: [], isElective: true, electiveGroup: 'CS-803 Open' },
          { id: 'cs803c', name: 'CS-803(C) - Internet of Things (IoT)',                                                   units: [], isElective: true, electiveGroup: 'CS-803 Open' },
          { id: 'cs8proj', name: 'Major Project / Dissertation / Viva-Voce',                                              units: [] },
          { id: 'cs8int',  name: 'Internship (as per college requirements)',                                               units: [] },
        ],
      },
    },
  },
}
