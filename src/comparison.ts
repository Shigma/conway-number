import { UniOp, BinOp } from './types'
import { Zero } from './index'

/** greater than or equal to */
export const ge: BinOp<boolean> = (x, y) => x.R.gf(y) && y.L.lf(x)

/** less than or equal to */
export const le: BinOp<boolean> = (x, y) => y.R.gf(x) && x.L.lf(y)

/** greater than or fuzzy with */
export const gf: BinOp<boolean> = (x, y) => !le(x, y)

/** less than or fuzzy with */
export const lf: BinOp<boolean> = (x, y) => !ge(x, y)

/** equal to */
export const equal: BinOp<boolean> = (x, y) => ge(x, y) && le(x, y)

/** greater than */
export const greater: BinOp<boolean> = (x, y) => ge(x, y) && !le(x, y)

/** less than */
export const less: BinOp<boolean> = (x, y) => !ge(x, y) && le(x, y)

/** fuzzy with */
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
