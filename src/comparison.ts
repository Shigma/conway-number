import { UniOp, BinOp } from './types'
import { Zero } from './index'

/** greater than or equal to */
export const ge: BinOp<boolean> = (x, y) => x.R.every(n => !ge(y, n)) && y.L.every(n => !ge(n, x))

/** less than or equal to */
export const le: BinOp<boolean> = (x, y) => y.R.every(n => !ge(x, n)) && x.L.every(n => !ge(n, y))

/** equal to */
export const equal: BinOp<boolean> = (x, y) => ge(x, y) && le(x, y)

/** greater than */
export const greater: BinOp<boolean> = (x, y) => ge(x, y) && !le(x, y)

/** less than */
export const less: BinOp<boolean> = (x, y) => !ge(x, y) && le(x, y)

/** fuzzy between */
export const fuzzy: BinOp<boolean> = (x, y) => !ge(x, y) && !le(x, y)

/** positive */
export const isPos: UniOp<boolean> = x => greater(x, Zero)

/** negative */
export const isNeg: UniOp<boolean> = x => less(x, Zero)

/** zero */
export const isZero: UniOp<boolean> = x => equal(x, Zero)

enum CompareResult {
  fuzzy = 0,
  less = 1,
  greater = 2,
  equal = 3,
}

/** compare between 2 numbers */
export const compare: BinOp<string> = (x, y) => {
  return CompareResult[Number(ge(x, y)) * 2 + Number(le(x, y))]
}
