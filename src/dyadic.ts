import { ConwayNumber } from './index'

interface DevideResult {
  order: number
  quotient: number
}

export function devidedBy2(n: number, max: number = Infinity): DevideResult {
  let i = 0
  while (n % 2 === 0 && i < max) {
    i += 1
    n /= 2
  }
  return {
    order: i,
    quotient: n,
  }
}

export default class ConwayDyadic implements ConwayNumber {
  _ln: number
  _lp: number
  _rn: number
  _rp: number
  numerator: number
  power: number

  constructor(numerator: number, power: number = 0) {
    this.numerator = numerator
    this.power = power
    if (numerator) {
      let result: DevideResult
      result = devidedBy2(numerator - 1, power)
      this._ln = result.quotient
      this._lp = power - result.order
      result = devidedBy2(numerator + 1, power)
      this._rn = result.quotient
      this._rp = power - result.order
    }
  }

  get L() {
    if (!this.numerator || !this._lp && this._ln + 1 < this._rn && this._rn <= 0) return []
    return [new ConwayDyadic(this._ln, this._lp)]
  }

  get R() {
    if (!this.numerator || !this._rp && this._ln + 1 < this._rn && this._ln >= 0) return []
    return [new ConwayDyadic(this._rn, this._rp)]
  }

  toString(): string {
    return this.power
      ? `${this.numerator}/${1 << this.power}`
      : this.numerator.toString()
  }
}
