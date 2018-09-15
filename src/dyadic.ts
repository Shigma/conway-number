import { ConwayNumber } from './index'

interface DivideResult {
  order: number
  quotient: number
}

function dividedBy2(n: number, max: number = Infinity): DivideResult {
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
      let result: DivideResult
      result = dividedBy2(numerator - 1, power)
      this._ln = result.quotient
      this._lp = power - result.order
      result = dividedBy2(numerator + 1, power)
      this._rn = result.quotient
      this._rp = power - result.order
    }
  }

  get L() {
    return this.numerator ? [new ConwayDyadic(this._ln, this._lp)] : []
  }

  get R() {
    return this.numerator ? [new ConwayDyadic(this._rn, this._rp)] : []
  }

  toString() {
    return `${this.numerator}/${1 << this.power}`
  }
}
