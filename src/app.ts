import { Probot } from 'probot'
import { DoubleBracktsHandler } from './utils/doubleBrackts'
import { BrackTermsSearch } from './bracktermssearch'
import { IssueCreator } from './issuecreator'
import { CitedOnHandler } from './citedonhandler'
import { SearchResult } from './types'

class ReplaceDoubleBracketsForMarkdownLinks {
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
          `[[${term.title}]`,
          `[${term.title}](${term.number})`
        ))
    )
    return this.body
  }
}

class UpdateBody {
  body: string
  context: any
  constructor (body: string, context: any) {
    this.body = body
    this.context = context
  }

  async update () {
    const [updateFunction, key, value] =
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
    updateObj[key] = value
    updateObj.body = this.body

    await updateFunction(this.context.repo(updateObj))
  }
}

export const app = (probot: Probot): void => {
  probot.on(
    [
      'issues.opened',
      'issues.edited',
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
      const newBody = new ReplaceDoubleBracketsForMarkdownLinks(
        body,
        termsIssues
      ).replace()
      await new UpdateBody(newBody, context).update()
      await new CitedOnHandler(termsIssues, context, newBody).handle()
    }
  )
}
