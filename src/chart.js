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

module.exports = chart;
