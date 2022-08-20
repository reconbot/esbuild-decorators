import { assert } from 'chai'
import { strip } from '../strip-it'
import { readFileSync } from 'fs'

describe('Strip It', () => {
  it('Can remove comments and strings from text', () => {
    const testFile = readFileSync(
      `${__dirname}/mock-project/app/src/strip-it.ts.test`,
      'utf-8',
    )

    const result = strip(testFile)
      .replace(/[:[\]\n]|\s*/g, '')
      .replace(/_/g, ' ')

    assert.equal(result, 'THIS SHOULD ALL BE WHAT\'S LEFT OF THE ENTIRE FILE')
  })
})
