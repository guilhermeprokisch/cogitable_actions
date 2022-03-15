import { DoubleBrackts } from './doubleBrackts'

const negative_cases = [
  { value: 'Test of body without brackts', expected: false },
  { value: 'One more comment whitout brackts', expected: false },
  { value: 'Test test test [ test', expected: false }
]

describe('DoubleBrackts', () => {
  it.each(negative_cases)(
    'Should contains method return false if there`s not double brackets',
    ({ value, expected }) => {
      const doubleBrackts = new DoubleBrackts(value)
      const itContains = doubleBrackts.contains()
      expect(itContains).toBe(expected)
    }
  )
})
