const entity = require('../examples/input.json');

function prepareData(entities, { sprintId } ) {

  const sprint = entities.find(obj => obj.type === 'Sprint' && obj.id === sprintId);

  const comments = entities.filter(obj => obj.type === 'Comment' && obj.createdAt >= sprint.startAt && obj.createdAt <= sprint.finishAt);

  const users  = entities.filter(obj => obj.type === 'User');

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

  return {
    alias: 'leaders',
    data: {
      title: 'Самый 🔎 внимательный разработчик',
      "subtitle": `Спринт № ${sprintId}`,
      "emoji": "🔎",
      "users": usersForVote
    }
  }
}

console.log(prepareData(entity, { sprintId: 984 }))

module.exports = { prepareData }
