const entity = require('../../examples/input.json');
const output = require('../../examples/output.json');
const { prepareData } = require('../../build/index.js');

it('Builded prepareData func output match with output.json', () => {
  expect(prepareData(entity, { sprintId: 977 })).toStrictEqual(output);
  expect(prepareData(entity, { sprintId: 977 }).length).toBe(5);
});
