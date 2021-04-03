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

module.exports = leaders;