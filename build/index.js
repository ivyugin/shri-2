const entity = require('../examples/input.json');

function prepareData(entities, { sprintId } ) {

  const sprint = entities.find(obj => obj.type === 'Sprint' && obj.id === sprintId);

  //Сущности попавшие в спринт
  const comments = entities.filter(obj => obj.type === 'Comment' && obj.createdAt >= sprint.startAt && obj.createdAt <= sprint.finishAt);
  const commits = entities.filter(obj => obj.type === 'Commit' && obj.timestamp >= sprint.startAt && obj.timestamp <= sprint.finishAt);

  const users  = entities.filter(obj => obj.type === 'User');

//==========================================
//leaders
//==========================================

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
      temp = `${user.valueText}  голос`;
    } else {
      temp = `${user.valueText}  голос${user.valueText % 10 >= 5 || user.valueText % 10 === 0 ? 'ов' : 'а'}`
    }
    usersForVote[index].valueText = temp;
  });

//==========================================
//leaders
//==========================================

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

  return JSON.stringify([
    {
      alias: 'vote',
      data: {
        title: 'Самый 🔎 внимательный разработчик',
        "subtitle": sprint.name,
        "emoji": "🔎",
        "users": usersForVote
      }
    },
    {
      alias: 'leaders',
      data: {
        title: 'Больше всего коммитов',
        "subtitle": sprint.name,
        "emoji": "👑",
        "users": usersForLeaders
      }
    }
  ])
}

console.log(prepareData(entity, { sprintId: 977 }))

module.exports = { prepareData }
