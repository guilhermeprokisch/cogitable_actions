import { Probot } from 'probot'
import { DoubleBracktsHandler } from './utils/doubleBrackts'
import { BrackTermsSearch } from './bracktermssearch'
import { SearchResult } from './types'

class IssueCreator {
  searchResults: SearchResult[]
  context: any

  constructor (searchResults: SearchResult[], context: any) {
    this.searchResults = searchResults
    this.context = context
  }

  private async createNewIssue (result: SearchResult) {
    if (result.number) {
      return result
    }

    const newIssue = await this.context.octokit.rest.issues.create(
      this.context.repo({
        title: 'Testo',
        body: ' '
      })
    )
    result.number = newIssue.data.number
    result.title = newIssue.data.title
    return result
  }

  async create (): Promise<SearchResult[]> {
    return await Promise.all(this.searchResults.map(async (result) => await this.createNewIssue(result)))
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
      const searchResults = await new BrackTermsSearch(
        bracketTerms,
        context
      ).search()

            
      const x = await new IssueCreator(searchResults, context).create()
      console.log(x)
      // console.log(searchResults2)

      // const current_issue = context.payload.issue

      // const issueComment = context.issue({
      //   body: 'Thanks for opening this issue!'
      // })

      // await context.octokit.issues.createComment(issueComment)
    }
  )
}
