import { Probot } from 'probot'
import { DoubleBracktsHandler } from './utils/doubleBrackts'

class BrackTermsSearch {
  terms: string[]
  context: any

  constructor (terms: string[], context: any) {
    this.terms = terms
    this.context = context
  }

  private async searchTerm (term: string): Promise<any> {
    const results = await this.context.octokit.search.issuesAndPullRequests(
      this.context.repo({
        q: term + `repo:${this.context.repo().owner}`,
        order: 'asc',
        per_page: 1
      })
    )
    return results
  }

  async search () {
    return await Promise.all(this.terms.map(async (term) => await this.searchTerm(term)))
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

      // there's a issue here with protobot types
      // @ts-ignore
      const body = context.payload.comment ? context.payload.comment.body : context.payload.issue.body

      const doubleBracktsHandler = new DoubleBracktsHandler(body)
      if (!doubleBracktsHandler.contains()) {
        return
      }

      const bracketTerms = doubleBracktsHandler.extract()
      const searchResults = await new BrackTermsSearch(bracketTerms, context).search()

      // const current_issue = context.payload.issue

      // const issueComment = context.issue({
      //   body: 'Thanks for opening this issue!'
      // })

      // await context.octokit.issues.createComment(issueComment)
    }
  )
}
