function prepareData(entities, { sprintId }) {
  const leaders = require('./leaders');
  const vote = require('./vote');
  const chart = require('./chart');
  const diagram = require('./diagram');
  const activity = require('./activity');

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

  const commitsLeader = leaders(sprintCommits, users);

  return [
    {
      alias: 'leaders',
      data: {
        title: 'Больше всего коммитов',
        subtitle: currentSprint.name,
        emoji: '👑',
        users: commitsLeader,
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
        users: commitsLeader,
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
