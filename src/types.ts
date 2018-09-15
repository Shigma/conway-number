import { ConwayNumber } from './index'

export type UniOp<R> = (x: ConwayNumber) => R
export type BinOp<R> = (x: ConwayNumber, y: ConwayNumber) => R
export type MultiOp<R> = (...args: ConwayNumber[]) => R
