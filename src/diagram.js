function diagram(sprintCommits, summaries, previousSprintCommits) {

  let previousCommitSizeS = 0;
  let previousCommitSizeM = 0;
  let previousCommitSizeL = 0;
  let previousCommitSizeXL = 0;

  previousSprintCommits.forEach((commit, index) => {

    //Считаем размер комита

    const size = commit.summaries.reduce((accumulator, summary) => {
      if (typeof summary === 'object') {
        return accumulator + summary.added + summary.removed;
      } else {
        const sumummaryTemp = summaries.find(sum => sum.id === summary);
        return accumulator + sumummaryTemp.added + sumummaryTemp.removed;
      }
    }, 0);

    //Распределяем по группам

    if (size <= 100) previousCommitSizeS += 1
      else if (size <= 500) previousCommitSizeM += 1
        else if (size <= 1000) previousCommitSizeL += 1
          else previousCommitSizeXL += 1
  })

  let commitSizeS = 0;
  let commitSizeM = 0;
  let commitSizeL = 0;
  let commitSizeXL = 0;

  sprintCommits.forEach((commit, index) => {

    //Считаем размер комита

    const size = commit.summaries.reduce((accumulator, summary) => {
      if (typeof summary === 'object') {
        return accumulator + summary.added + summary.removed;
      } else {
        const sumummaryTemp = summaries.find(sum => sum.id === summary);
        return accumulator + sumummaryTemp.added + sumummaryTemp.removed;
      }
    }, 0);

    //Распределяем по группам

    if (size <= 100) commitSizeS += 1
      else if (size <= 500) commitSizeM += 1
        else if (size <= 1000) commitSizeL += 1
          else commitSizeXL += 1
  })

  return [
    {
      "title": "> 1001 строки",
      "valueText": `${commitSizeXL} ${formOfWord(commitSizeXL, 'commit')}`,
      "differenceText": createDifferenceString(commitSizeXL, previousCommitSizeXL)
    },
    {
      "title": "501 — 1000 строк",
      "valueText": `${commitSizeL} ${formOfWord(commitSizeL, 'commit')}`,
      "differenceText": createDifferenceString(commitSizeL, previousCommitSizeL)
    },
    {
      "title": "101 — 500 строк",
      "valueText": `${commitSizeM} ${formOfWord(commitSizeM, 'commit')}`,
      "differenceText": createDifferenceString(commitSizeM, previousCommitSizeM)
    },
    {"title": "1 — 100 строк",
    "valueText": `${commitSizeS} ${formOfWord(commitSizeS, 'commit')}`,
    "differenceText": createDifferenceString(commitSizeS, previousCommitSizeS)
  }
  ];
}

function createDifferenceString(size, preSize) {
  const difference = size - preSize;
  return `${difference > 0 ? '+' + difference : difference} ${formOfWord(Math.abs(difference), 'commit')}`
}


function formOfWord(n, word) {
  words = {
    commit: ['коммит', 'коммита', 'коммитов']
  }
  if (n >= 10 && n < 20) return words[word][2];
  if (n % 10 === 1) return words[word][0];
  if (n % 10 < 5) return words[word][1];
  return words[2];
}

module.exports = diagram;