import { ConwayNumber, LSet, RSet } from './index'

const impartials = []

export default class ConwayImpartial implements ConwayNumber {
  public tag: 'impartial'
  public order: number

  constructor(order: number) {
    this.order = order
    while (impartials.length < order) {
      new ConwayImpartial(impartials.length)
    }
    if (!(order in impartials)) {
      impartials.push(this)
    }
  }

  get L(): LSet {
    return new LSet(impartials.slice(0, this.order))
  }

  get R(): RSet {
    return new RSet(impartials.slice(0, this.order))
  }

  toString(): string {
    return this.order
      ? `<Impartial: ${this.order}>`
      : '0'
  }
}
