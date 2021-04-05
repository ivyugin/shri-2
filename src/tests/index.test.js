const entity = require('../../examples/input.json');
const output = require('../../examples/output.json');
const { prepareData } = require('../index.js');

it('Match script result with output.json', () => {
  expect(prepareData(entity, { sprintId: 977 })).toStrictEqual(output);
  expect(prepareData(entity, { sprintId: 977 }).length).toBe(5);
});
