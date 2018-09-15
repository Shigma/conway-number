import { ConwayNumber } from './index'

export default class ConwayDyadic implements ConwayNumber {
  _l: number = null
  _r: number = null
  value: number

  constructor(value: number) {
    this.value = value
    if (value > 0) {
      this._l = value - 1
    } else if (value < 0) {
      this._r = value + 1
    }
  }

  get L() {
    return this._l ? [new ConwayDyadic(this._l)] : []
  }

  get R() {
    return this._r ? [new ConwayDyadic(this._r)] : []
  }

  toString() {
    return String(this.value)
  }
}
