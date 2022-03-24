import { SearchResult } from './types'

export class CitedOnHandler {
  id: number

  constructor (private terms: SearchResult[], private context: any, private body: string) {
    this.terms = terms
    this.body = body
    this.context = context
    this.id = this.context.payload.comment // @ts-ignore
      ? this.context.payload.comment.id
      : this.context.payload.issue.id
  }

  async commentCited (term: SearchResult) {
    await this.context.octokit.issues.createComment(
      this.context.repo({
        issue_number: term.number,
        body: ` ######  Mention in [${this.context.payload.issue.title} #${this.context.payload.issue.number}](${this.context.payload.issue.number}#issuecomment-${this.id})  \n > ${this.body}`
      })
    )
  }

  async handle () {
    Promise.all(this.terms.map(async (term) => await this.commentCited(term)))
  }
}
