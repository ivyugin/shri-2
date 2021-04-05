const entity = require('../../examples/input.json');
const output = require('../../examples/output.json');
const leaders = require('../leaders.js');

const users = entity.filter((obj) => obj.type === 'User');
const commits = entity.filter((obj) => obj.type === 'Commit');
const sprints = entity.filter((obj) => obj.type === 'Sprint');

const currentSprint = sprints.find((sprint) => sprint.id === 977);

const sprintCommits = commits.filter((commit) => commit.timestamp >= currentSprint.startAt
    && commit.timestamp <= currentSprint.finishAt);

it('Match script result with output.json', () => {
  expect(leaders(sprintCommits, users)).toStrictEqual(output[0].data.users);
});

it('Array type, data type', () => {
  expect(Array.isArray(leaders(sprintCommits, users))).toBeTruthy();
  expect(Object.prototype.toString.call(leaders(sprintCommits, users)[0])).toBe('[object Object]');
  expect(Object.keys(leaders(sprintCommits, users)[0])).toStrictEqual(['id', 'name', 'avatar', 'valueText']);
  expect(typeof leaders(sprintCommits, users)[0].id).toBe('number');
});
