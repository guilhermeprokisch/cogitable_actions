export class DoubleBrackts {
  regex = /\[\[(.+?)\]\]/g
  body: string
  matchs: string[]

  constructor (body: string) {
    this.body = body
    this.matchs = this.body.match(this.regex)
  }

  contains (): any {
    return !!this.matchs
  }
}
