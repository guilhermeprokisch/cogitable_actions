import nock from 'nock'
import { app } from '../src/app'
import { Probot, ProbotOctokit } from 'probot'
import { privateKey } from './utils/create-mock-cert'
import { issueOpened } from './fixtures/payloads/income'
import { issueCreatedBody } from './fixtures/payloads/outcome'

describe('Cogitable', () => {
  let probot: any

  beforeEach(() => {
    nock.disableNetConnect()
    probot = new Probot({
      appId: 123,
      privateKey,
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false }
      })
    })
    // Load our app into probot
    probot.load(app)
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  test('creates a comment when an issue is opened', async done => {
    const mock = nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, {
        token: 'test',
        permissions: {
          issues: 'write'
        }
      })

      .post('/repos/hiimbex/testing-things/issues/1/comments', (body: any) => {
        done(expect(body).toMatchObject(issueCreatedBody))
        return true
      })
      .reply(200)

    await probot.receive({ name: 'issues', payload: issueOpened })

    expect(mock.pendingMocks()).toStrictEqual([])
  })
})
