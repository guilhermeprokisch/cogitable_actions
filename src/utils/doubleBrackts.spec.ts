import { DoubleBracktsHandler } from './doubleBrackts'

const negativeCases = [
  { value: 'Test of body without brackts', expected: false },
  { value: 'One more comment whitout brackts', expected: false },
  { value: 'Test test test [ test', expected: false }
]

const positiveCases = [
  {
    value: 'Test of string [[with]] double brackets',
    bracketsExtected: ['with'],
    expected: true
  },
  {
    value: '[[One more]] test',
    bracketsExtected: ['One more'],
    expected: true
  },
  {
    value: '[[Brackts]] again test [[Second]]',
    bracketsExtected: ['Brackts', 'Second'],
    expected: true
  }
]

describe('DoubleBrackts', () => {
  it.each(negativeCases)(
    'Should contains method return false if there is not double brackets',
    ({ value, expected }) => {
      const sut = new DoubleBracktsHandler(value)
      const itContains = sut.contains()
      expect(itContains).toBe(expected)
    }
  )

  it.each(positiveCases)(
    'Should contains method return true if there is double brackets',
    ({ value, expected }) => {
      const sut = new DoubleBracktsHandler(value)
      const itContains = sut.contains()
      expect(itContains).toBe(expected)
    }
  )

  it.each(positiveCases)(
    'Should returns a list of extracted double brackets',
    ({ value, bracketsExtected }) => {
      const sut = new DoubleBracktsHandler(value)
      const itContains = sut.extract()
      expect(itContains).toStrictEqual(bracketsExtected)
    }
  )
})
