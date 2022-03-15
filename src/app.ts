import { Probot } from 'probot'

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

      const issueComment = context.issue({
        body: 'Thanks for opening this issue!'
      })

      await context.octokit.issues.createComment(issueComment)
    }
  )
}
