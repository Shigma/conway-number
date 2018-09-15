import Dyadic from './dyadic'
export * from './comparison'
export { Dyadic }

export interface ConwayNumber {
  L: ConwayNumber[]
  R: ConwayNumber[]
}

export function from(L: ConwayNumber[], R: ConwayNumber[]): ConwayNumber {
  return { L, R }
}
