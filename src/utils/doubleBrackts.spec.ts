import { DoubleBrackts } from './doubleBrackts'

const negativeCases = [
  { value: 'Test of body without brackts', expected: false },
  { value: 'One more comment whitout brackts', expected: false },
  { value: 'Test test test [ test', expected: false }
]

const positiveCases = [
  { value: 'Test of string [[with]] double brackets', expected: true },
  { value: '[[One more]] test', expected: true },
  { value: '[[Brackts]] again test [[Second]]', expected: true }
]

describe('DoubleBrackts', () => {
  it.each(negativeCases)(
    'Should contains method return false if there is not double brackets',
    ({ value, expected }) => {
      const doubleBrackts = new DoubleBrackts(value)
      const itContains = doubleBrackts.contains()
      expect(itContains).toBe(expected)
    }
  )

  it.each(positiveCases)(
    'Should contains method return true if there is double brackets',
    ({ value, expected }) => {
      const doubleBrackts = new DoubleBrackts(value)
      const itContains = doubleBrackts.contains()
      expect(itContains).toBe(expected)
    }
  )
})
