
import { SearchResult } from './types'

export class BrackTermsSearch {
  terms: string[]
  context: any

  constructor (terms: string[], context: any) {
    this.terms = terms
    this.context = context
  }

  private async searchTerm (term: string): Promise<any> {
    const results = await this.context.octokit.search.issuesAndPullRequests(
      this.context.repo({
        q: term + `repo:${this.context.repo().owner}/${this.context.repo().repo}`,
        order: 'asc',
        per_page: 1
      })
    )
    return results
  }

  private parseResult (term:string, rawResult:any): SearchResult {
    const parsedResult = {
      term: term,
      number: rawResult.data.items[0] ? rawResult.data.items[0].number : null,
      title: rawResult.data.items[0] ? rawResult.data.items[0].title : null,
      url: rawResult.data.items[0] ? rawResult.data.items[0].url : null
    }

    if (parsedResult.term !== parsedResult.title) {
      parsedResult.title = null
      parsedResult.number = null
      parsedResult.url = null
    }

    return parsedResult
  }

  async search () {
    const rawResult = await Promise.all(this.terms.map(async (term) => await this.searchTerm(term)))
    return rawResult.map((result, index) => this.parseResult(this.terms[index], result))
  }
}
