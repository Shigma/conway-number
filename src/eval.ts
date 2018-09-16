import { build, ConwayNumber } from './index'
import { Lexer, LexerToken } from './lexer'
import ConwayDyadic, { devidedBy2 } from './dyadic'
import ConwayImpartial from './impartial'

const lexer = Lexer.from({
  main: [
    {
      include: 'expression'
    },
  ],
  expression: [
    {
      regex: /[a-zA-Z_]\w*/,
      token: (cap) => ({
        type: 'variable',
        name: cap[0],
      })
    },
    {
      regex: /< *Impartial: *(\d+) *>/,
      token: (cap) => ({
        type: 'impartial',
        order: Number(cap[1]),
      })
    },
    {
      regex: /(\d+)(?:([/.])(\d+))?/,
      token(cap) {
        return !cap[2] || cap[2] === '/' && devidedBy2(Number(cap[3])).quotient === 1
          ? {
            type: 'dyadic',
            numerator: Number(cap[1]),
            power: cap[2] ? Number(cap[3]) : 0,
          }
          : {
            type: 'real',
            value: cap[2] === '/' ? Number(cap[1]) / Number(cap[3]) : Number(cap[0])
          }
      }
    },
    {
      regex: /{/,
      type: 'literal',
      push: [
        {
          regex: /}/,
          pop: true,
        },
        {
          regex: /, */,
        },
        {
          regex: /\|/,
          push: [
            {
              regex: /(?:})/,
              pop: true,
            },
            {
              regex: /, */,
            },
            {
              include: 'expression',
            },
          ],
          token: (cap, content) => ({
            type: 'separator',
            content,
          })
        },
        {
          include: 'expression',
        },
      ],
      token(cap, cont) {
        return {
          type: 'literal',
          L: cont.slice(0, -1),
          R: cont[cont.length - 1].content,
        }
      }
    },
  ],
})

function parseNode(node: LexerToken): ConwayNumber {
  switch (node.type) {
    case 'impartial': return new ConwayImpartial(node.order)
    case 'dyadic': return new ConwayDyadic(node.numerator, node.power)
    case 'literal': return build(node.L.map(parseNode), node.R.map(parseNode))
    default: throw new Error('Unsupported type: ' + node.type)
  }
}

export default function evaluate(source: string) {
  const ast: LexerToken[] = lexer.parse(source).result
  return parseNode(ast[0])
}
