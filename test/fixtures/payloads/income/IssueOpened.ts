export const issueOpened = {
  action: 'opened',
  issue: {
    number: 1,
    body: 'Issue with [[double]] [[brackets]]',
    user: {
      login: 'guilhermeprokisch'
    }
  },
  repository: {
    name: 'ideias',
    owner: {
      login: 'guilhermeprokisch'
    }
  },
  sender: {
    type: 'User'
  },
  installation: {
    id: 2
  }
}

export const issueOpenedWithoutBrackts = {
  action: 'opened',
  issue: {
    number: 1,
    body: 'Issue without double brackets',
    user: {
      login: 'guilhermeprokisch'
    }
  },
  repository: {
    name: 'ideias',
    owner: {
      login: 'guilhermeprokisch'
    }
  },
  sender: {
    type: 'User'
  },
  installation: {
    id: 2
  }
}
