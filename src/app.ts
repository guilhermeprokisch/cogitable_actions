import { Probot } from 'probot'
import { DoubleBracktsHandler } from './utils/doubleBrackts'
import { BrackTermsSearch } from './bracktermssearch'
import { IssueCreator } from './issuecreator'
import { SearchResult } from './types'

class CurrentIssueGetter {
  constructor (private context: any) {
    this.context = context
  }

  async get () {
    return this.context.name === 'issues' ? this.context.payload.issue : await this.context.github.issues.get(this.context.repo({ issue_number: this.context.issue().number })).data
  }
}

class CitedOnHandler {
  id: number
  private currentIssue: any

  constructor (private terms: SearchResult[], private context: any) {
    this.terms = terms
    this.context = context
    this.id = context.payload.comment // @ts-ignore
      ? context.payload.comment.id
      : context.payload.issue.id
    this.currentIssue = new CurrentIssueGetter(context).get()
  }

  async commentCited (term: SearchResult) {
    await this.context.octokit.issues.createComment(
      this.context.repo({
        issue_number: term.number,
        body: `Mentioned in [${this.currentIssue.title}](${this.currentIssue.number}#issuecomment-${this.id})  \n > `
      })
    )
  }

  async handle () {
    Promise.all(this.terms.map(async (term) => await this.commentCited(term)))
  }
}

export const app = (probot: Probot): void => {
  probot.on(
    [
      'issues.opened',
      'issues.edited',
      'issue_comment',
      'issue_comment.created',
      'issue_comment.edited'
    ],
    async context => {
      if (context.payload.sender.type === 'Bot') {
        return
      }

      // ts-ingore due a issue with protobot types
      // @ts-ignore
      const body = context.payload.comment // @ts-ignore
        ? context.payload.comment.body
        : context.payload.issue.body
      const doubleBracktsHandler = new DoubleBracktsHandler(body)
      if (!doubleBracktsHandler.contains()) {
        return
      }
      const bracketTerms = doubleBracktsHandler.extract()
      const search = await new BrackTermsSearch(bracketTerms, context).search()
      const termsIssues = await new IssueCreator(search, context).create()
      await new CitedOnHandler(termsIssues, context).handle()

      // const current_issue = context.payload.issue
      // const issueComment = context.issue({
      //   body: 'Thanks for opening this issue!'
      // })
      // await context.octokit.issues.createComment(issueComment)
    }
  )
}
