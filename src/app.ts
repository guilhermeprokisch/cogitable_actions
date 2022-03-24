import { Probot } from 'probot'
import { DoubleBracktsHandler } from './utils/doubleBrackts'
import { BrackTermsSearch } from './bracktermssearch'
import { IssueCreator } from './issuecreator'
import { CitedOnHandler } from './citedonhandler'
import {
  ReplaceDoubleBracketsForMarkdownLinks,
  UpdateBody
} from './replacebrackets'

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
