import * as comparison from './comparison'

export { comparison }

export interface ConwayNumber {
  L: ConwayNumber[]
  R: ConwayNumber[]
}
