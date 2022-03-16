export const commentOpened = {
  action: 'opened',
  issue: {
    number: 1,
    user: {
      login: 'guilhermeprokisch'
    }
  },
  comment: {
    id: 11,
    body: '[[Comment]] with [[double]] brackets'
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

export const commentOpenedWithoutBrackts = {
  action: 'opened',
  issue: {
    number: 1,
    user: {
      login: 'guilhermeprokisch'
    }
  },
  comment: {
    id: 11,
    body: 'Comment without double brackets'
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
