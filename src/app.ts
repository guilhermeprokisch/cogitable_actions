import { Probot } from 'probot'
import { DoubleBracktsHandler } from './utils/doubleBrackts'

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

      let body: string
      switch (context.name) {
        case 'issues': {
          // const id = context.payload.issue.id
          body = context.payload.issue.body
          break
        }
        case 'issue_comment': {
          // const id = context.payload.comment.id
          body = context.payload.comment.body
          break
        }
      }

      const doubleBracktsHandler = new DoubleBracktsHandler(body)

      if (!doubleBracktsHandler.contains()) {
        return
      }
      // const current_issue = context.payload.issue

      // const issueComment = context.issue({
      //   body: 'Thanks for opening this issue!'
      // })

      // await context.octokit.issues.createComment(issueComment)
    }
  )
}
