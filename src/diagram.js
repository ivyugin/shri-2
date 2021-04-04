const { formOfWord } = require('./utilites');

function createDifferenceString(size, preSize) {
  const difference = size - preSize;
  return `${difference > 0 ? `+${difference}` : difference} ${formOfWord(Math.abs(difference), 'commit')}`;
}

function sprintSize(commitsInSprint, summaries) {
  const commitSize = {
    s: 0,
    m: 0,
    l: 0,
    xl: 0,
  };

  commitsInSprint.forEach((commit) => {
    // Считаем размер комита
    const size = commit.summaries.reduce((accumulator, summary) => {
      if (typeof summary === 'object') {
        return accumulator + summary.added + summary.removed;
      }
      const sumummaryTemp = summaries.find((sum) => sum.id === summary);
      return accumulator + sumummaryTemp.added + sumummaryTemp.removed;
    }, 0);

    // Распределяем по группам
    if (size <= 100) commitSize.s += 1;
    else if (size <= 500) commitSize.m += 1;
    else if (size <= 1000) commitSize.l += 1;
    else commitSize.xl += 1;
  });

  return commitSize;
}

function diagram(sprintName, sprintCommits, summaries, previousSprintCommits) {
  const previousSprintSize = sprintSize(previousSprintCommits, summaries);
  const currentSprintSize = sprintSize(sprintCommits, summaries);

  const differenceCommitCount = sprintCommits.length - previousSprintCommits.length;
  const commitCount = sprintCommits.length;

  let total;
  if (commitCount % 10 === 1) {
    total = `${commitCount} коммит`;
  } else {
    total = `${commitCount} коммит${commitCount % 10 >= 5 || commitCount % 10 === 0 ? 'ов' : 'а'}`;
  }

  return {
    title: 'Размер коммитов',
    subtitle: sprintName,
    totalText: total,
    differenceText: `${differenceCommitCount > 0 ? `+${differenceCommitCount}` : differenceCommitCount} с прошлого спринта`,
    categories: [
      {
        title: '> 1001 строки',
        valueText: `${currentSprintSize.xl} ${formOfWord(currentSprintSize.xl, 'commit')}`,
        differenceText: createDifferenceString(currentSprintSize.xl, previousSprintSize.xl),
      },
      {
        title: '501 — 1000 строк',
        valueText: `${currentSprintSize.l} ${formOfWord(currentSprintSize.l, 'commit')}`,
        differenceText: createDifferenceString(currentSprintSize.l, previousSprintSize.l),
      },
      {
        title: '101 — 500 строк',
        valueText: `${currentSprintSize.m} ${formOfWord(currentSprintSize.m, 'commit')}`,
        differenceText: createDifferenceString(currentSprintSize.m, previousSprintSize.m),
      },
      {
        title: '1 — 100 строк',
        valueText: `${currentSprintSize.s} ${formOfWord(currentSprintSize.s, 'commit')}`,
        differenceText: createDifferenceString(currentSprintSize.s, previousSprintSize.s),
      },
    ],
  };
}

module.exports = diagram;
