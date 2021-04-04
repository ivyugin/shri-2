const { formOfWord } = require('./utilites');

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

module.exports = vote;
