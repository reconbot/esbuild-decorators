import { assert } from 'chai'
import { esbuildDecorators } from '../esbuild-decorators'

describe('plugin tests', () => {
  const mockBuilder = (options) => {
    let _filter
    let _fn
    const onLoad = (filter, fn) => {
      _filter = filter
      _fn = fn
    }
    const initialOptions: { tsconfig?: string } = options
    const simulate = async (args) => _fn(args)
    return { onLoad, simulate, initialOptions }
  }

  let mockService

  before(() => {
    mockService = mockBuilder({
      tsconfig: 'wrong/config/file/for/testing/just/to/make/sure/override/works',
    })
    const plugin = esbuildDecorators({
      tsconfig: `${__dirname}/mock-project/app/tsconfig.app.json`,
    })
    plugin.setup(mockService)
  })

  it('Can return undefined if no decorators are found', async () => {
    const result = await mockService.simulate({
      path: `${__dirname}/mock-project/app/src/no-decorators.ts.test`,
    })

    assert.isUndefined(result)
  })

  it('Can return transpiled code if decorators are found', async () => {
    const result = await mockService.simulate({
      path: `${__dirname}/mock-project/app/src/mixed-example.ts.test`, //mixed-example
    })
    assert.isDefined(result)
  })

  it('Can transpile successfully on various test cases', async () => {
    const TOTAL_TESTS = 10

    const results = await Promise.all(
      [...new Array(TOTAL_TESTS - 1)].map((_, i) =>
        mockService.simulate({
          path: `${__dirname}/mock-project/app/src/copy-${i + 1}.ts.test`, //mixed-example
        }),
      ),
    )

    results.forEach((result) => {
      assert.isDefined(result)
    })
  })
})
