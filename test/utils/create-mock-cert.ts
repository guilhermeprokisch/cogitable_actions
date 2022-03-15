import fs from 'fs'
import path from 'path'

export const privateKey = fs.readFileSync(
  path.join(__dirname, '../fixtures/mock-cert.pem'),
  'utf-8'
)
