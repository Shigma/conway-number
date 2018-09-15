export * from './comparison'
export * from './arithmetic'

import Dyadic from './dyadic'
import Impartial from './impartial'
import evaluate from './eval'
export { Dyadic, Impartial, evaluate as eval }

export interface ConwayNumber {
  toString?: () => string
  L: ConwayNumber[]
  R: ConwayNumber[]
}

export const Zero: ConwayNumber = {
  toString: () => '0',
  L: [],
  R: [],
}

export function build(L: ConwayNumber[], R: ConwayNumber[]): ConwayNumber {
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
