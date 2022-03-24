import { SearchResult } from './types'

export class ReplaceDoubleBracketsForMarkdownLinks {
  body: string
  terms: SearchResult[]
  constructor (body: string, terms: SearchResult[]) {
    this.body = body
    this.terms = terms
  }

  replace () {
    this.terms.forEach(
      term =>
        (this.body = this.body.replace(
          `[[${term.title}]]`,
          `[${term.title}](${term.url
            .replace('/repos', '')
            .replace('api.', '')})`
        ))
    )
    return this.body
  }
}

export class UpdateBody {
  body: string
  context: any
  constructor (body: string, context: any) {
    this.body = body
    this.context = context
  }

  async update () {
    const [updateFunction, keyName, value] =
      this.context.name === 'issues'
        ? [
            this.context.octokit.issues.update,
            'issue_number',
            this.context.payload.issue.number
          ]
        : [
            this.context.octokit.issues.updateComment,
            'comment_id',
            this.context.payload.comment.id
          ]

    const updateObj: any = {}
    updateObj[keyName] = value
    updateObj.body = this.body

    await updateFunction(this.context.repo(updateObj))
  }
}
