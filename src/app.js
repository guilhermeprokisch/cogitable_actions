/**
 * @param {import('probot').Probot} app
 */
module.exports = app => {
  app.on(
    [
      'issues.created',
      'issue_comment.created',
      'issue_comment.edited',
      'issues.edited'
    ],
    async context => {
      app.log(context.name)
      if (context.isBot && context.name === 'issue_comment') {
        return
      }

      if (context.name === 'issues') {
        const id = context.payload.issue.id
        const body = context.payload.issue.body
      } else {
        const body = context.payload.comment.body
        const id = context.payload.comment.id
      }

      const reg = /\[\[(.+?)\]\]/g
      const links = []
      const owner = context.repo().owner
      const repo = context.repo().repo
      const onwerRepo = owner + '/' + repo

      if (context.name === 'issues') {
        const currentIssue = context.payload.issue
      } else {
        const currentIssue = await context.github.issues.get(
          context.repo({
            issue_number: context.issue().number
          })
        )
        currentIssue = currentIssue.data
      }

      if (body.match(/\[\[(.+?)\]\]/g)) {
        let match
        while ((match = reg.exec(body)) !== null) {
          const link = match[1]
          context.github.search
          const results = await context.github.search.issuesAndPullRequests(
            context.repo({
              q: link + `repo:${onwerRepo}`,
              order: 'asc',
              per_page: 1
            })
          )
          const items = results.data.items
          app.log(typeof items[0] !== 'undefined')
          if (typeof items !== 'undefined' && typeof items[0] !== 'undefined') {
            const resultNumber = items[0].number
            const resultTitle = items[0].title
          } else {
            const resultTitle = null
          }
          let link_number
          if (link === resultTitle) {
            link_number = resultNumber
          } else {
            let new_issue = await context.github.issues.create(
              context.repo({
                title: link,
                body: ' '
              })
            )
            link_number = new_issue.data.number
          }
          links.push([link, link_number])
        }
      } else {
        app.log('No Matchs')
      }
      links.forEach(
        link =>
          (body = body.replace(`[[${link[0]}]]`, `[${link[0]}](${link[1]})`))
      )

      links.forEach(link =>
        context.github.issues.createComment(
          context.repo({
            issue_number: link[1],
            body:
              `Mentioned in [${current_issue.title}](${current_issue.number}#issuecomment-${id})  \n > ` +
              body
          })
        )
      )

      if (context.name === 'issues') {
        await context.github.issues.update(
          context.repo({
            issue_number: current_issue.number,
            body: body
          })
        )
      } else {
        await context.github.issues.updateComment(
          context.repo({
            comment_id: id,
            body: body
          })
        )
      }
    }
  )
}
