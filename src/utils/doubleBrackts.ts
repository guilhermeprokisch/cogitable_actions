export class DoubleBracktsHandler {
  regex = /\[\[(.+?)\]\]/g
  body: string
  matchs: string[]

  constructor (body: string) {
    this.body = body
    this.matchs = this.body
      .match(this.regex)
      ?.map(match => match.replace('[[', '').replace(']]', ''))
  }

  contains (): boolean {
    return !!this.matchs
  }

  extract (): string[] {
    return this.matchs ? this.matchs : []
  }
}
