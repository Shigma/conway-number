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

/** multiply */
export const multiply: BinRel = (x, y) => {
  return from([
    ...[].concat(...x.L.map(xl => y.L.map(yl => sub(add(multiply(xl, y), multiply(x, yl)), multiply(xl, yl))))),
    ...[].concat(...x.R.map(xr => y.R.map(yr => sub(add(multiply(xr, y), multiply(x, yr)), multiply(xr, yr))))),
  ], [
    ...[].concat(...x.L.map(xl => y.R.map(yr => sub(add(multiply(xl, y), multiply(x, yr)), multiply(xl, yr))))),
    ...[].concat(...x.R.map(xr => y.L.map(yl => sub(add(multiply(xr, y), multiply(x, yl)), multiply(xr, yl))))),
  ])
}
