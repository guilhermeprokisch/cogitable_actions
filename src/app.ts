import { Probot } from 'probot'

export const app = (probot: Probot): void => {
  probot.on('issues.opened', async context => {
    const issueComment = context.issue({
      body: 'Thanks for opening this issue!'
    })
    await context.octokit.issues.createComment(issueComment)
  })
}
