export * from './comparison'
export * from './arithmetic'

import Dyadic from './dyadic'
import Impartial from './impartial'
import evaluate from './eval'
export { Dyadic, Impartial, evaluate as eval }

import { gf, lf } from './comparison'

export interface ConwayNumber {
  tag?: string
  L: ConwayLSet
  R: ConwayRSet
  [ key: string ]: any
  toString?: () => string
}

export interface ConwaySet {
  map<T>(callback: (n: ConwayNumber, index: number, array: ConwayNumber[]) => T): T[]
}

export interface ConwayLSet extends ConwaySet {
  lf(n: ConwayNumber): boolean
  maxReduce?(): ConwayLSet
}

export class LRSet implements ConwaySet {
  public data: ConwayNumber[]

  constructor(data: ConwayNumber[]) {
    this.data = data
  }

  map<T>(callback: (n: ConwayNumber, index: number, array: ConwayNumber[]) => T): T[] {
    return this.data.map(callback)
  }
}

export class LSet extends LRSet implements ConwayLSet {
  lf(n: ConwayNumber): boolean {
    return this.data.every(m => lf(m, n))
  }
}

export interface ConwayRSet extends ConwaySet {
  gf(n: ConwayNumber): boolean
  minReduce?(): ConwayLSet
}

export class RSet extends LRSet implements ConwayRSet {
  gf(n: ConwayNumber): boolean {
    return this.data.every(m => gf(m, n))
  }
}

export function build(L: ConwayNumber[], R: ConwayNumber[]): ConwayNumber {
  return { L: new LSet(L), R: new RSet(R) }
}

export const Zero: ConwayNumber = build([], [])
Zero.toString = () => '0'

export function tree(x: ConwayNumber, depth: number = 1): string {
  if (!depth) return x.toString()
  return `{ ${
    x.L.map(xl => tree(xl, depth - 1)).join(', ')
  } | ${
    x.R.map(xr => tree(xr, depth - 1)).join(', ')
  } }`
}
