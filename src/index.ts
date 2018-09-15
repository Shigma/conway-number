export * from './comparison'
export * from './arithmetic'

import Dyadic from './dyadic'
export { Dyadic }

export interface ConwayNumber {
  L: ConwayNumber[]
  R: ConwayNumber[]
}

export function from(L: ConwayNumber[], R: ConwayNumber[]): ConwayNumber {
  return { L, R }
}

export function tree(x: ConwayNumber, depth: number = 1): string {
  if (!depth) return x.toString()
  return `{ ${
    x.L.map(xl => tree(xl, depth - 1)).join(', ')
  } | ${
    x.R.map(xr => tree(xr, depth - 1)).join(', ')
  } }`
}
