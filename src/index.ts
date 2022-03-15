import adapterGithubActions from '@probot/adapter-github-actions'
import { app } from './app'

adapterGithubActions.run(app)
