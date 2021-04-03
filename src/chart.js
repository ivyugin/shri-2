function chart(commits, allSprints, currentSprintId) {

  const values = [];

  allSprints.forEach(sprint => {
    let temp = {
      'title': sprint.id,
      'hint': sprint.name,
      'value': 0
    }

    if (sprint.id === currentSprintId)
      temp.active =  true;

    values.push(temp)
  });

  commits.forEach(commit => {

    commit.sprintId = allSprints.find(sprint => commit.timestamp >= sprint.startAt && commit.timestamp <= sprint.finishAt).id;

    let valueIndex = values.findIndex(value => value.title === commit.sprintId);

    if (valueIndex != -1) {
      values[valueIndex].value += 1;
    }
  })

  values.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  return values;
}

module.exports = chart;