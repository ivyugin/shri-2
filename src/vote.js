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

module.exports = vote;