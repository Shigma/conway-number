import { ConwayNumber, build } from './index'
import { UniOp, BinOp, MultiOp } from './types'

/** negative */
export const negative: UniOp<ConwayNumber> = x => build(x.R.map(negative), x.L.map(negative))

const addTwo: BinOp<ConwayNumber> = (x, y?) => {
  if (!y) return x
  return build([
    ...x.L.map(xl => addTwo(xl, y)),
    ...y.L.map(yl => addTwo(x, yl)),
  ], [
    ...x.R.map(xr => addTwo(xr, y)),
    ...y.R.map(yr => addTwo(x, yr)),
  ])
}

/** add */
export const add: MultiOp<ConwayNumber> = (...list) => {
  return list.reduce((prev, curr) => addTwo(curr, prev))
}

/** subtract */
export const sub: BinOp<ConwayNumber> = (x, y) => addTwo(x, negative(y))

const multiplyTwo: BinOp<ConwayNumber> = (x, y?) => {
  if (!y) return x
  return build([
    ...[].concat(...x.L.map(xl => y.L.map((yl) => {
      return sub(addTwo(multiplyTwo(xl, y), multiplyTwo(x, yl)), multiplyTwo(xl, yl))
    }))),
    ...[].concat(...x.R.map(xr => y.R.map((yr) => {
      return sub(addTwo(multiplyTwo(xr, y), multiplyTwo(x, yr)), multiplyTwo(xr, yr))
    }))),
  ], [
    ...[].concat(...x.L.map(xl => y.R.map((yr) => {
      return sub(addTwo(multiplyTwo(xl, y), multiplyTwo(x, yr)), multiplyTwo(xl, yr))
    }))),
    ...[].concat(...x.R.map(xr => y.L.map((yl) => {
      return sub(addTwo(multiplyTwo(xr, y), multiplyTwo(x, yl)), multiplyTwo(xr, yl))
    }))),
  ])
}

/** multiply */
export const multiply: MultiOp<ConwayNumber> = (...list) => {
  return list.reduce((prev, curr) => multiplyTwo(curr, prev))
}
