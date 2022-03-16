import nock from 'nock'
import { app } from '../src/app'
import { Probot, ProbotOctokit } from 'probot'
import { privateKey } from './utils/create-mock-cert'
import {
  issueOpened,
  issueOpenedWithoutBrackts,
  issueOpenedByBot,
  commentOpened,
  commentOpenedWithoutBrackts,
  commentOpenedByBot
} from './fixtures/payloads/income'

import {
  anyTermPayloadComment,
  anyTerm2PayloadComment,
  anyTermPayloadIssue,
  anyTerm2PayloadIssue
} from './fixtures/payloads/outcome'

import {
  anyTermIssueResponse,
  anyTerm2IssueResponse,
  anyTermCommentResponse,
  anyTerm2CommentResponse
} from './fixtures/payloads/income/searchResults'

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

  // it('Should creates a comment when an issue is opened', async () => {
  //   const mock = nock('https://api.github.com')
  //     .post('/app/installations/2/access_tokens')
  //     .reply(200, {
  //       token: 'test',
  //       permissions: {
  //         issues: 'write'
  //       }
  //     })

  //     .post(
  //       '/repos/guilhermeprokisch/ideias/issues/1/comments',
  //       (body: any) => {
  //         expect(body).toMatchObject(issueCreatedBody)
  //         return true
  //       }
  //     )
  //     .reply(200)

  //   await probot.receive({ name: 'issues', payload: issueOpened })

  //   expect(mock.pendingMocks()).toStrictEqual([])
  // })

  it('Should do nothing when a issue or comment is created by a bot', async () => {
    const mock = nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, {
        token: 'test',
        permissions: {
          issues: 'write'
        }
      })

    await probot.receive({ name: 'issues', payload: issueOpenedByBot })
    await probot.receive({
      name: 'issue_comment',
      payload: commentOpenedByBot
    })

    expect(mock.isDone()).toBeFalsy()
  })

  it('Should do nothing for comments or issues without double brackets', async () => {
    const mock = nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, {
        token: 'test',
        permissions: {
          issues: 'write'
        }
      })

    await probot.receive({
      name: 'issues',
      payload: issueOpenedWithoutBrackts
    })
    await probot.receive({
      name: 'issue_comment',
      payload: commentOpenedWithoutBrackts
    })

    expect(mock.isDone()).toBeFalsy()
  })

  it('Should search on repository for all brackts terms for issue', async () => {
    const mock = nock('https://api.github.com')
      .persist()
      .post('/app/installations/2/access_tokens')
      .reply(200, {
        token: 'test',
        permissions: {
          issues: 'write'
        }
      })
      .get('/search/issues')
      .query(anyTermPayloadIssue)
      .reply(200, JSON.stringify(anyTermIssueResponse))
      .get('/search/issues')
      .query(anyTerm2PayloadIssue)
      .reply(200, JSON.stringify(anyTerm2IssueResponse))

    await probot.receive({ name: 'issues', payload: issueOpened })

    expect(mock.pendingMocks()).toStrictEqual([])
  })

  it('Should search on repository for all brackts terms for comment', async () => {
    const mock = nock('https://api.github.com')
      .persist()
      .post('/app/installations/2/access_tokens')
      .reply(200, {
        token: 'test',
        permissions: {
          issues: 'write'
        }
      })
      .get('/search/issues')
      .query(anyTermPayloadComment)
      .reply(200, JSON.stringify(anyTermCommentResponse))
      .get('/search/issues')
      .query(anyTerm2PayloadComment)
      .reply(200, JSON.stringify(anyTerm2CommentResponse))

    await probot.receive({
      name: 'issue_comment',
      payload: commentOpened
    })
    expect(mock.pendingMocks()).toStrictEqual([])
  })
})
