type StringLike = string | RegExp

export interface LexerToken {
  type: string
  text?: string
  content?: LexerToken[]
  start?: number
  end?: number
  [key: string]: any
}

interface LexerIncludeRule { include: string }
interface LexerRegexRule<S extends StringLike> {
  /** the regular expression to execute */
  regex?: S
  /**
   * a string containing all the rule flags:
   * - `b`: match when the context begins
   * - `e`: match end of line
   * - `i`: ignore case
   * - `p`: pop from the current context
   * - `t`: match top level context
   */
  flags?: string
  /** default type of the token */
  type?: string
  /** whether the rule is to be executed */
  test?: string | boolean
  /** a result token */
  token?: (
    this: Lexer, capture: RegExpExecArray, content: LexerToken[], rule: this
  ) => LexerToken | LexerToken[]
  /** the inner context */
  push?: string | LexerRule<S>[] | ((
    this: Lexer, capture: RegExpExecArray
  ) => string | LexerRule<S>[] | false)
  /** pop from the current context */
  pop?: boolean
  /** match when the context begins */
  context_begins?: boolean
  /** match top level context */
  top_level?: boolean
  /** whether to ignore case */
  ignore_case?: boolean
  /** match end of line */
  eol?: boolean
}

type LexerContext = string | NativeLexerRule[]
type LexerRule<S extends StringLike> = LexerRegexRule<S> | LexerIncludeRule
type LooseLexerRule = LexerRule<StringLike>
type NativeLexerRule = LexerRule<RegExp>
export type LexerRules = Record<string, LooseLexerRule[]>

function getString(string: StringLike): string {
  return string instanceof RegExp ? string.source : string
}

interface LexerResult {
  index: number
  result: LexerToken[]
}

export class Lexer {
  private rules: Record<string, NativeLexerRule[]> = {}
  
  constructor(rules: LexerRules) {
    function resolve(rule: LooseLexerRule): NativeLexerRule {
      if (!('include' in rule)) {
        if (rule.regex === undefined) {
          rule.regex = /(?=[\s\S])/
          if (!rule.type) rule.type = 'default'
        }
        if (rule.test === undefined) rule.test = true
        let src = getString(rule.regex)
        let flags = ''
        rule.flags = rule.flags || ''
        if (rule.flags.replace(/[biept]/g, '')) {
          throw new Error(`'${rule.flags}' contains invalid rule flags.`)
        }
        if (rule.flags.includes('p')) rule.pop = true
        if (rule.flags.includes('b')) rule.context_begins = true
        if (rule.flags.includes('t')) rule.top_level = true
        if (rule.flags.includes('e') || rule.eol) src += ' *(?:\\n+|$)'
        if (rule.flags.includes('i') || rule.ignore_case) flags += 'i'
        rule.regex = new RegExp('^(?:' + src + ')', flags)
        if (rule.push instanceof Array) rule.push.forEach(resolve)
      }
      return rule as NativeLexerRule
    }

    for (const key in rules) {
      this.rules[key] = rules[key].map(resolve)
    }
  }

  private getContext(context: LexerContext): LexerRegexRule<RegExp>[] {
    const result = typeof context === 'string' ? this.rules[context] : context
    if (!result) throw new Error(`Context '${context}' was not found.`)
    for (let i = result.length - 1; i >= 0; i -= 1) {
      const rule: NativeLexerRule = result[i]
      if ('include' in rule) {
        result.splice(i, 1, ...this.getContext(rule.include))
      }
    }
    return result as LexerRegexRule<RegExp>[]
  }

  public parse(
    source: string,
    context: LexerContext = 'main',
    isTopLevel: boolean = true
  ): LexerResult {
    let index = 0, unmatch = ''
    const result: LexerToken[] = []
    const rules = this.getContext(context)
    source = source.replace(/\r\n/g, '\n')
    while (source) {
      /**
       * Matching status:
       * 0. No match was found
       * 1. Found match and continue
       * 2. Found match and pop
       */
      let status = 0
      for (const rule of rules) {
        if (rule.top_level && !isTopLevel) continue
        if (rule.context_begins && index) continue

        // regex
        const capture = rule.regex.exec(source)
        if (!capture) continue
        source = source.slice(capture[0].length)
        const start = index
        index += capture[0].length

        // pop
        const pop = rule.pop
        status = pop ? 2 : 1

        // push
        let content: LexerToken[] = [], push = rule.push
        if (typeof push === 'function') push = push.call(this, capture)
        if (push) {
          const subtoken = this.parse(source, push as LexerContext, false)
          content = subtoken.result.map((tok) => {
            tok.start += index
            tok.end += index
            return tok
          })
          source = source.slice(subtoken.index)
          index += subtoken.index
        }

        // detect error
        if (!pop && index === start) {
          throw new Error(`Endless loop at '${
            source.slice(0, 10)
          } ${
            source.length > 10 ? '...' : ''
          }'.`)
        }

        // resolve unmatch
        if (unmatch) {
          result.push({
            type: 'unknown',
            text: unmatch,
          })
          unmatch = ''
        }

        // token
        if (rule.token) {
          result.push(rule.token.call(this, capture, content))
        }

        break
      }

      if (!status) {
        if (source.charAt(0) !== ' ') {
          unmatch += source.charAt(0)
        }
        source = source.slice(1)
        index += 1
      }
      if (status === 2) break
    }

    if (unmatch) result.push({
      type: 'unknown',
      text: unmatch,
    })
    return { index, result }
  }

  static from(rules: LexerRules): Lexer {
    return new Lexer(rules)
  }
}
