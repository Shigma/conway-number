import { ConwayNumber } from './index'

export type UniOp<R, T = ConwayNumber> = (x: T) => R
export type BinOp<R, T = ConwayNumber> = (x: T, y: T) => R
export type MultiOp<R, T = ConwayNumber> = (...args: T[]) => R
