import { Probot } from 'probot'
import { DoubleBracktsHandler } from './utils/doubleBrackts'
import { BrackTermsSearch } from './bracktermssearch'

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

      // new IssueCreator(seakrchResults).create()

      // console.log(searchResults)

      // const current_issue = context.payload.issue

      // const issueComment = context.issue({
      //   body: 'Thanks for opening this issue!'
      // })

      // await context.octokit.issues.createComment(issueComment)
    }
  )
}
