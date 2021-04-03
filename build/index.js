function prepareData(entities, { sprintId } ) {

  let sprints = [];
  let users = [];
  let comments = [];
  let commits = [];
  let summaries = [];

  entities.forEach(obj => {
    switch (obj.type) {
      case 'Sprint':
        sprints.push(obj);
        break;
      case 'User':
        users.push(obj);
        break;
      case 'Comment':
        comments.push(obj);
        break;
      case 'Commit':
        commits.push(obj);
        break;
      case 'Summary':
        summaries.push(obj);
        break;
    }
  })

  const currentSprint = sprints.find(sprint => sprint.id === sprintId);
  const previousSprint = sprints.find(sprint => sprint.id === sprintId - 1);

  const sprintComments = comments.filter(comment => comment.type === 'Comment' && comment.createdAt >= currentSprint.startAt && comment.createdAt <= currentSprint.finishAt);

  const sprintCommits = commits.filter(commit => commit.timestamp >= currentSprint.startAt && commit.timestamp <= currentSprint.finishAt);
  const previousSprintCommits = commits.filter(commit => commit.timestamp >= previousSprint.startAt && commit.timestamp <= previousSprint.finishAt);

  //=========== diagram
  const differenceCommitCount = sprintCommits.length - previousSprintCommits.length;
  const commitCount = sprintCommits.length;
  let totalText;
  if (commitCount % 10 === 1) {
    totalText = `${commitCount} коммит`;
  } else {
    totalText = `${commitCount} коммит${commitCount % 10 >= 5 || commitCount % 10 === 0 ? 'ов' : 'а'}`
  }
  //==========

  const commitsLeader = leaders(sprintCommits, users);
 
  return [
    {
      alias: 'vote',
      data: {
        "title": 'Самый 🔎 внимательный разработчик',
        "subtitle": currentSprint.name,
        "emoji": "🔎",
        "users": vote(sprintComments, users)
      }
    },
    {
      alias: 'leaders',
      data: {
        "title": 'Больше всего коммитов',
        "subtitle": currentSprint.name,
        "emoji": "👑",
        "users": commitsLeader
      }
    },
    {
      alias: 'chart',
      data: {
        "title": 'Коммиты',
        "subtitle": currentSprint.name,
        "values": chart(commits, sprints, sprintId),
        "users": commitsLeader
      }
    },
    {
      alias: 'diagram',
      data: {
        "title": 'Размер коммитов',
        "subtitle": currentSprint.name,
        "totalText": totalText,
        "differenceText": `${differenceCommitCount > 0 ? '+'+differenceCommitCount : differenceCommitCount} с прошлого спринта`,
        "categories": diagram(sprintCommits, summaries, previousSprintCommits)
      }
    }
  ]
}

function chart(commits, allSprints, currentSprintId) {

  const values = [];

  allSprints.forEach(sprint => {
    let temp = {
      'title': sprint.id,
      'hint': sprint.name,
      'value': 0
    }

    if (sprint.id === currentSprintId)
      temp.active =  true;

    values.push(temp)
  });

  commits.forEach(commit => {

    commit.sprintId = allSprints.find(sprint => commit.timestamp >= sprint.startAt && commit.timestamp <= sprint.finishAt).id;

    let valueIndex = values.findIndex(value => value.title === commit.sprintId);

    if (valueIndex != -1) {
      values[valueIndex].value += 1;
    }
  })

  values.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  return values;
}

function diagram(sprintCommits, summaries, previousSprintCommits) {

  let previousCommitSizeS = 0;
  let previousCommitSizeM = 0;
  let previousCommitSizeL = 0;
  let previousCommitSizeXL = 0;

  previousSprintCommits.forEach((commit, index) => {

    //Считаем размер комита

    const size = commit.summaries.reduce((accumulator, summary) => {
      if (typeof summary === 'object') {
        return accumulator + summary.added + summary.removed;
      } else {
        const sumummaryTemp = summaries.find(sum => sum.id === summary);
        return accumulator + sumummaryTemp.added + sumummaryTemp.removed;
      }
    }, 0);

    //Распределяем по группам

    if (size <= 100) previousCommitSizeS += 1
      else if (size <= 500) previousCommitSizeM += 1
        else if (size <= 1000) previousCommitSizeL += 1
          else previousCommitSizeXL += 1
  })

  let commitSizeS = 0;
  let commitSizeM = 0;
  let commitSizeL = 0;
  let commitSizeXL = 0;

  sprintCommits.forEach((commit, index) => {

    //Считаем размер комита

    const size = commit.summaries.reduce((accumulator, summary) => {
      if (typeof summary === 'object') {
        return accumulator + summary.added + summary.removed;
      } else {
        const sumummaryTemp = summaries.find(sum => sum.id === summary);
        return accumulator + sumummaryTemp.added + sumummaryTemp.removed;
      }
    }, 0);

    //Распределяем по группам

    if (size <= 100) commitSizeS += 1
      else if (size <= 500) commitSizeM += 1
        else if (size <= 1000) commitSizeL += 1
          else commitSizeXL += 1
  })

  return [
    {
      "title": "> 1001 строки",
      "valueText": `${commitSizeXL} ${formOfWord(commitSizeXL, 'commit')}`,
      "differenceText": createDifferenceString(commitSizeXL, previousCommitSizeXL)
    },
    {
      "title": "501 — 1000 строк",
      "valueText": `${commitSizeL} ${formOfWord(commitSizeL, 'commit')}`,
      "differenceText": createDifferenceString(commitSizeL, previousCommitSizeL)
    },
    {
      "title": "101 — 500 строк",
      "valueText": `${commitSizeM} ${formOfWord(commitSizeM, 'commit')}`,
      "differenceText": createDifferenceString(commitSizeM, previousCommitSizeM)
    },
    {"title": "1 — 100 строк",
    "valueText": `${commitSizeS} ${formOfWord(commitSizeS, 'commit')}`,
    "differenceText": createDifferenceString(commitSizeS, previousCommitSizeS)
  }
  ];
}

function createDifferenceString(size, preSize) {
  const difference = size - preSize;
  return `${difference > 0 ? '+' + difference : difference} ${formOfWord(Math.abs(difference), 'commit')}`
}


function formOfWord(n, word) {
  words = {
    commit: ['коммит', 'коммита', 'коммитов']
  }
  if (n >= 10 && n < 20) return words[word][2];
  if (n % 10 === 1) return words[word][0];
  if (n % 10 < 5) return words[word][1];
  return words[2];
}

function leaders(commits, users) {

  const usersForLeaders = [];

  commits.forEach(commit => {

    let userId = typeof commit.author === 'object' ? commit.author.id : commit.author;

    let userIndex = usersForLeaders.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      let user = users.find(user => user.id === userId);
      usersForLeaders.push({'id': user.id, 'name': user.name, 'avatar': user.avatar, 'valueText': 1})
    } else {
      usersForLeaders[userIndex].valueText += 1;
    }
  })

  usersForLeaders.sort((a, b) => {
    if (a.valueText > b.valueText) return -1;
    if (a.valueText < b.valueText) return 1;
    return 0;
  });

  return usersForLeaders;
}

function vote(comments, users) {
  const usersForVote = [];

  comments.forEach(comment => {

    let userId = typeof comment.author === 'object' ? comment.author.id : comment.author;

    let userIndex = usersForVote.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      let user = users.find(user => user.id === userId);
      usersForVote.push({'id': user.id, 'name': user.name, 'avatar': user.avatar, 'valueText': comment.likes.length})
    } else {
      usersForVote[userIndex].valueText += comment.likes.length;
    }
  })

  usersForVote.sort((a, b) => {
    if (a.valueText > b.valueText) return -1;
    if (a.valueText < b.valueText) return 1;
    return 0;
  });

  usersForVote.forEach((user, index) => {
    const lastChar = user.valueText % 10;
    let temp;
    if (lastChar === 1) {
      temp = `${user.valueText} голос`;
    } else {
      temp = `${user.valueText} голос${user.valueText % 10 >= 5 || user.valueText % 10 === 0 ? 'ов' : 'а'}`
    }
    usersForVote[index].valueText = temp;
  });

  return usersForVote;
}

module.exports = {prepareData}
