import { SearchResult } from './types'

export class IssueCreator {
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
        title: result.term,
        body: ' '
      })
    )
    result.number = newIssue.data.number
    result.title = newIssue.data.title
    result.url = newIssue.data.url
    return result
  }

  async create (): Promise<SearchResult[]> {
    return await Promise.all(this.searchResults.map(async (result) => await this.createNewIssue(result)))
  }
}
