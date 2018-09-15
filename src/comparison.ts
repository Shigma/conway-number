import { ConwayNumber } from './index'

type Comparison = (x: ConwayNumber, y: ConwayNumber) => boolean

/** greater than or equal to */
export const ge: Comparison = (x, y) => x.R.every(n => !ge(y, n)) && y.L.every(n => !ge(n, x))

/** less than or equal to */
export const le: Comparison = (x, y) => y.R.every(n => !ge(x, n)) && x.L.every(n => !ge(n, y))

/** equal to */
export const equal: Comparison = (x, y) => ge(x, y) && le(x, y)

/** greater than */
export const greater: Comparison = (x, y) => ge(x, y) && !le(x, y)

/** less than */
export const less: Comparison = (x, y) => !ge(x, y) && le(x, y)

/** fuzzy between */
export const fuzzy: Comparison = (x, y) => !ge(x, y) && !le(x, y)
