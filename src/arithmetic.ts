import {ConwayNumber, from} from './index'

/** unary relation */
type UniRel = (x: ConwayNumber) => ConwayNumber

/** binary relation */
type BinRel = (x: ConwayNumber, y: ConwayNumber) => ConwayNumber

/** negative */
export const negative: UniRel = x => {
    return from(x.R.map(negative), x.L.map(negative))
}

/** add */
export const add: BinRel = (x, y) => {
    let L: ConwayNumber[] = []
    let R: ConwayNumber[] = []
    x.L.forEach(xl => {
        L.push(add(xl, y))
    })
    y.L.forEach(yl => {
        L.push(add(x, yl))
    })
    x.R.forEach(xr => {
        R.push(add(xr, y))
    })
    y.R.forEach(yr => {
        R.push(add(x, yr))
    })
    return from(L, R)
}

/** sub */
export const sub: BinRel = (x, y) => {
    return add(x, negative(y))
}