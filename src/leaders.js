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
    if (a.valueText <= b.valueText) return 1;
    return 0;
  });

  usersForLeaders.forEach((user, index) => {
    usersForLeaders[index].valueText = usersForLeaders[index].valueText.toString();
  });

  return usersForLeaders;
}

module.exports = leaders;
