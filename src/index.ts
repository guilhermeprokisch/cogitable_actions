import { ApplicationFunction } from 'probot'
import { cogitable } from './app'

declare function run(
  probotApp: ApplicationFunction | ApplicationFunction[]
): Promise<void>;

run(cogitable)
