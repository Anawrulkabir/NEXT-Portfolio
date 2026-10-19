/**
 * Research content — see docs/PORTFOLIO_REDESIGN.md §06.4, §03.5
 *
 * Three separate research lines (C3, needs confirmation whether R455A/
 * R1336mzz(E) share a supervisor/lab with the thesis): the PINN/airfoil
 * thesis is fluid dynamics; the refrigerant work is experimental heat
 * transfer. Do not merge them or imply shared findings.
 */
import { pending } from './pending'
import type { Research } from './types'

export const research: Research[] = [
  {
    id: 'pinn-naca0012-thesis',
    kind: 'thesis',
    // Academic CV [C1]
    title:
      'Localized forgetting in parameter-efficient adaptation of a frozen physics-informed airfoil surrogate',
    shortTitle: 'Localized forgetting in PEFT',
    status: 'under-review', // C1, 10th BSME ICTFE, under review
    oneLine:
      'Adapting a released physics-informed airfoil surrogate beyond its training range with low-rank updates, and measuring what it forgets.',
    question: pending('ADD research question wording'),
    system: 'Flow around an airfoil, at conditions outside the surrogate’s training range',
    data: pending('ADD thesis dataset / simulation setup'),
    method: [
      'Low-rank (parameter-efficient) updates to a released, frozen physics-informed airfoil surrogate',
      'CFD reference data generated in SU2',
      'Eight adaptation methods compared on accuracy and forgetting',
    ],
    investigating: [
      pending('ADD what specifically is being investigated beyond the one-line summary'),
    ],
    findings: [], // only author-supplied; empty until thesis completes
    supervisor: 'Prof. Dr. Md. Abu Mowazzem Hossain, CUET',
    // Repo / PDF links: add here once available (see docs §14 checklist).
    links: [],
    figures: [],
    tags: ['pytorch', 'pinn', 'lora'],
    updated: '2026-07',
  },
  {
    id: 'r455a-evaporation-ml',
    kind: 'manuscript',
    title: 'Optimizing evaporation heat transfer predictions of low GWP R455A in an industrial plate heat exchanger via machine learning', // Academic CV [J1]
    shortTitle: 'R455A evaporation heat transfer, ML prediction',
    status: 'under-review',
    oneLine:
      'Machine-learning prediction of evaporation heat transfer of low-GWP refrigerant R455A in an industrial plate heat exchanger.',
    question: pending('ADD research question wording'),
    system: 'Evaporation of low-GWP refrigerant R455A in an industrial plate heat exchanger',
    data: pending('ADD dataset size and operating ranges'),
    method: [
      'Dimensionless parameters and interaction features (physics-based feature engineering)',
      'Gradient boosting models',
      'Cross-condition validation to test generalisation beyond seen operating conditions',
      'SHAP-based interpretability and regime analysis',
    ],
    investigating: [
      'How feature representation and validation strategy affect model generalization with a relatively small experimental dataset',
    ],
    findings: [], // do not publish until author confirms it's safe pre-publication
    pipeline: [
      {
        stage: 'Experimental system',
        text: 'Evaporation of low-GWP R455A in an industrial plate heat exchanger.',
      },
      {
        stage: 'Measurements',
        text: 'A relatively small experimental dataset.',
        detail: pending('ADD dataset size & operating ranges'),
      },
      {
        stage: 'Physics-based features',
        text: 'Dimensionless parameters and interaction features.',
      },
      {
        stage: 'Machine learning',
        text: 'Gradient-boosting models.',
        detail: pending('ADD full model list (gradient boosting confirmed; others?)'),
      },
      {
        stage: 'Validation',
        text: 'Cross-condition validation to test generalisation beyond seen operating conditions.',
      },
      {
        stage: 'Interpretation',
        text: 'SHAP-based interpretability and regime analysis.',
      },
    ],
    authors: pending('ADD R455A CO-AUTHORS'),
    venue: pending('ADD journal name — recommended: keep hidden while under review'),
    showVenue: false,
    doi: pending('ADD PAPER DOI — once published'),
    links: [],
    figures: [],
    tags: ['gradient-boosting', 'shap', 'feature-engineering'],
    updated: '2026-07',
  },
  {
    id: 'r1336mzze-condensation-ml',
    kind: 'project',
    title: 'Machine learning based prediction of the condensation heat transfer of low GWP refrigerant R1336mzz(E) in an industrial plate heat exchanger', // Academic CV [J2]
    shortTitle: 'R1336mzz(E) condensation, ML study',
    status: 'under-review', // Academic CV [J2]: International Journal of Refrigeration, under review
    oneLine:
      'Machine-learning study of condensation heat transfer of low-GWP refrigerant R1336mzz(E) in an industrial plate heat exchanger.',
    question: pending('ADD research question'),
    system: 'Condensation of low-GWP refrigerant R1336mzz(E) in an industrial plate heat exchanger',
    data: pending('ADD dataset'),
    method: [pending('ADD ML approach')],
    investigating: [pending('ADD what is currently being investigated')],
    findings: [],
    links: [],
    figures: [],
    tags: [],
    updated: '2026-07',
  },
]

/**
 * Research interests — SOP §10 condensed to six plain statements (§03.5).
 * No equations, no claims of results.
 */
export const researchInterests: string[] = [
  'Machine learning for engineering systems.',
  'Physics-informed and physics-guided machine learning.',
  'Computational modeling of fluid and thermal systems.',
  'Data-driven prediction of how engineering systems behave.',
  'AI-assisted engineering analysis, including low-cost intelligent systems.',
  'Heat transfer and refrigeration, especially low-GWP refrigerants.',
]

/** /academic header line (§11.1) — wording awaits the author. */
export const academicLine = pending(
  'CONFIRM /academic line: "Mechanical engineering researcher working on machine learning for engineering systems"'
)
