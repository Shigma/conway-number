import { ConwayNumber, from } from './index'

/** unary relation */
type UniRel = (x: ConwayNumber) => ConwayNumber

/** binary relation */
type BinRel = (x: ConwayNumber, y: ConwayNumber) => ConwayNumber

/** negative */
export const negative: UniRel = x => from(x.R.map(negative), x.L.map(negative))

/** add */
export const add: BinRel = (x, y) => {
  return from([
    ...x.L.map(xl => add(xl, y)),
    ...y.L.map(yl => add(x, yl)),
  ], [
    ...x.R.map(xr => add(xr, y)),
    ...y.R.map(yr => add(x, yr)),
  ])
}

/** subtract */
export const sub: BinRel = (x, y) => add(x, negative(y))
