function formOfWord(n, word) {
  const words = {
    commit: ['коммит', 'коммита', 'коммитов'],
    vote: ['голос', 'голоса', 'голосов'],
  };
  if (n % 100 >= 10 && n % 100 < 20) return words[word][2];
  if (n % 10 === 1) return words[word][0];
  if (n % 10 === 0) return words[word][2];
  if (n % 10 < 5) return words[word][1];
  return words[word][2];
}

function activity(sprintCommits) {
  const data = {
    sun: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    mon: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    tue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    wed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    thu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    fri: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    sat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  };

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  sprintCommits.forEach((commit) => {
    const date = new Date(commit.timestamp);

    data[days[date.getDay()]][date.getHours()] += 1;
  });

  return data;
}

function chart(commits, allSprints, currentSprintId) {
  const values = [];

  allSprints.forEach((sprint) => {
    const temp = {
      title: sprint.id,
      hint: sprint.name,
      value: 0,
    };

    if (sprint.id === currentSprintId) {
      temp.active = true;
    }

    values.push(temp);
  });

  commits.forEach((commit) => {
    const sprintId = allSprints.find(
      (sprint) => commit.timestamp >= sprint.startAt && commit.timestamp <= sprint.finishAt,
    ).id;

    const valueIndex = values.findIndex((value) => value.title === sprintId);

    if (valueIndex !== -1) {
      values[valueIndex].value += 1;
    }
  });

  values.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  values.forEach((value, index) => {
    values[index].title = values[index].title.toString();
  });

  return values;
}

function createDifferenceString(size, preSize) {
  const difference = size - preSize;
  return `${difference > 0 ? `+${difference}` : difference} ${formOfWord(Math.abs(difference), 'commit')}`;
}

function sprintSize(commitsInSprint, summaries) {
  const commitSize = {
    s: 0,
    m: 0,
    l: 0,
    xl: 0,
  };

  commitsInSprint.forEach((commit) => {
    // Считаем размер комита
    const size = commit.summaries.reduce((accumulator, summary) => {
      if (typeof summary === 'object') {
        return accumulator + summary.added + summary.removed;
      }
      const sumummaryTemp = summaries.find((sum) => sum.id === summary);
      return accumulator + sumummaryTemp.added + sumummaryTemp.removed;
    }, 0);

    // Распределяем по группам
    if (size <= 100) commitSize.s += 1;
    else if (size <= 500) commitSize.m += 1;
    else if (size <= 1000) commitSize.l += 1;
    else commitSize.xl += 1;
  });

  return commitSize;
}

function diagram(sprintName, sprintCommits, summaries, previousSprintCommits) {
  const previousSprintSize = sprintSize(previousSprintCommits, summaries);
  const currentSprintSize = sprintSize(sprintCommits, summaries);

  const differenceCommitCount = sprintCommits.length - previousSprintCommits.length;
  const commitCount = sprintCommits.length;

  let total;
  if (commitCount % 10 === 1) {
    total = `${commitCount} коммит`;
  } else {
    total = `${commitCount} коммит${commitCount % 10 >= 5 || commitCount % 10 === 0 ? 'ов' : 'а'}`;
  }

  return {
    title: 'Размер коммитов',
    subtitle: sprintName,
    totalText: total,
    differenceText: `${differenceCommitCount > 0 ? `+${differenceCommitCount}` : differenceCommitCount} с прошлого спринта`,
    categories: [
      {
        title: '> 1001 строки',
        valueText: `${currentSprintSize.xl} ${formOfWord(currentSprintSize.xl, 'commit')}`,
        differenceText: createDifferenceString(currentSprintSize.xl, previousSprintSize.xl),
      },
      {
        title: '501 — 1000 строк',
        valueText: `${currentSprintSize.l} ${formOfWord(currentSprintSize.l, 'commit')}`,
        differenceText: createDifferenceString(currentSprintSize.l, previousSprintSize.l),
      },
      {
        title: '101 — 500 строк',
        valueText: `${currentSprintSize.m} ${formOfWord(currentSprintSize.m, 'commit')}`,
        differenceText: createDifferenceString(currentSprintSize.m, previousSprintSize.m),
      },
      {
        title: '1 — 100 строк',
        valueText: `${currentSprintSize.s} ${formOfWord(currentSprintSize.s, 'commit')}`,
        differenceText: createDifferenceString(currentSprintSize.s, previousSprintSize.s),
      },
    ],
  };
}

function leaders(commits, users) {
  const usersForLeaders = [];

  commits.forEach((commit) => {
    const userId = typeof commit.author === 'object' ? commit.author.id : commit.author;

    const userIndex = usersForLeaders.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      const user = users.find((userTemp) => userTemp.id === userId);
      usersForLeaders.push({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        valueText: 1,
      });
    } else {
      usersForLeaders[userIndex].valueText += 1;
    }
  });

  usersForLeaders.sort((a, b) => {
    if (a.valueText > b.valueText) return -1;
    if (a.valueText < b.valueText) return 1;
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });

  usersForLeaders.forEach((user, index) => {
    usersForLeaders[index].valueText = `${user.valueText}`;
  });

  return usersForLeaders;
}

function vote(comments, users) {
  const usersForVote = [];

  comments.forEach((comment) => {
    const userId = typeof comment.author === 'object' ? comment.author.id : comment.author;

    const userIndex = usersForVote.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      const user = users.find((userTemp) => userTemp.id === userId);
      usersForVote.push({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        valueText: comment.likes.length,
      });
    } else {
      usersForVote[userIndex].valueText += comment.likes.length;
    }
  });

  usersForVote.sort((a, b) => {
    if (a.valueText > b.valueText) return -1;
    if (a.valueText < b.valueText) return 1;
    return 0;
  });

  usersForVote.forEach((user, index) => {
    usersForVote[index].valueText = `${user.valueText} ${formOfWord(user.valueText, 'vote')}`;
  });

  return usersForVote;
}

function prepareData(entities, { sprintId }) {
  const sprints = [];
  const users = [];
  const comments = [];
  const commits = [];
  const summaries = [];

  entities.forEach((obj) => {
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
      default:
        break;
    }
  });

  const currentSprint = sprints.find((sprint) => sprint.id === sprintId);
  const previousSprint = sprints.find((sprint) => sprint.id === sprintId - 1);

  const sprintComments = comments.filter((comment) => comment.createdAt >= currentSprint.startAt
    && comment.createdAt <= currentSprint.finishAt);

  const sprintCommits = commits.filter((commit) => commit.timestamp >= currentSprint.startAt
    && commit.timestamp <= currentSprint.finishAt);

  const previousSprintCommits = commits.filter(
    (commit) => commit.timestamp >= previousSprint.startAt
    && commit.timestamp <= previousSprint.finishAt,
  );

  // const commitsLeader = leaders(sprintCommits, users);

  return [
    {
      alias: 'leaders',
      data: {
        title: 'Больше всего коммитов',
        subtitle: currentSprint.name,
        emoji: '👑',
        users: leaders(sprintCommits, users),
      },
    },
    {
      alias: 'vote',
      data: {
        title: 'Самый 🔎 внимательный разработчик',
        subtitle: currentSprint.name,
        emoji: '🔎',
        users: vote(sprintComments, users),
      },
    },
    {
      alias: 'chart',
      data: {
        title: 'Коммиты',
        subtitle: currentSprint.name,
        values: chart(commits, sprints, sprintId),
        users: leaders(sprintCommits, users),
      },
    },
    {
      alias: 'diagram',
      data: diagram(currentSprint.name, sprintCommits, summaries, previousSprintCommits),
    },
    {
      alias: 'activity',
      data: {
        title: 'Коммиты',
        subtitle: currentSprint.name,
        data: activity(sprintCommits),
      },
    },
  ];
}

module.exports = { prepareData };
