import { ConwayNumber, from } from './index'
import { UniOp, BinOp, MultiOp } from './types'

/** negative */
export const negative: UniOp<ConwayNumber> = x => from(x.R.map(negative), x.L.map(negative))

const addTwo: BinOp<ConwayNumber> = (x, y?) => {
  if (!y) return x
  return from([
    ...x.L.map(xl => add(xl, y)),
    ...y.L.map(yl => add(x, yl)),
  ], [
    ...x.R.map(xr => add(xr, y)),
    ...y.R.map(yr => add(x, yr)),
  ])
}

/** add */
export const add: MultiOp<ConwayNumber> = (...list) => {
  return list.reduce((prev, curr) => addTwo(curr, prev))
}

/** subtract */
export const sub: BinOp<ConwayNumber> = (x, y) => addTwo(x, negative(y))
