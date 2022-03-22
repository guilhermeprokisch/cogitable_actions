import { Probot } from 'probot'
import { DoubleBracktsHandler } from './utils/doubleBrackts'
import { BrackTermsSearch } from './bracktermssearch'
import { IssueCreator } from './issuecreator'
import { SearchResult } from './types'

class CitedOnHandler {
  id: number

  constructor (private terms: SearchResult[], private context: any) {
    this.terms = terms
    this.context = context
    this.id = this.context.payload.comment // @ts-ignore
      ? this.context.payload.comment.id
      : this.context.payload.issue.id
  }

  async commentCited (term: SearchResult) {
    await this.context.octokit.issues.createComment(
      this.context.repo({
        issue_number: term.number,
        body: `Mentioned in [${this.context.issue.title}](${this.context.payload.issue.number}#issuecomment-${this.id})  \n > `
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
    }
  )
}
