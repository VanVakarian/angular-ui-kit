export const ProgressBarStyle = {
  Flat: 'flat',
  Raised: 'raised',
  Inset: 'inset',
} as const;

export type ProgressBarStyle = (typeof ProgressBarStyle)[keyof typeof ProgressBarStyle];
