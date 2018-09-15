import { ConwayNumber } from './index'

const impartials = []

export default class ConwayImpartial implements ConwayNumber {
  order: number

  constructor(order: number) {
    this.order = order
    while (impartials.length < order) {
      new ConwayImpartial(impartials.length)
    }
    if (!(order in impartials)) {
      impartials.push(this)
    }
  }

  get L(): ConwayNumber[] {
    return impartials.slice(0, this.order)
  }

  get R(): ConwayNumber[] {
    return impartials.slice(0, this.order)
  }
}
