//const entity = require('../examples/input.json');

const leaders = require('./leaders');
const vote = require('./vote');
const chart = require('./chart');
const diagram = require('./diagram');


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
 
  return JSON.stringify([
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
  ])
}

//console.log(prepareData(entity, { sprintId: 977 }))

module.exports = {prepareData}
