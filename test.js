const entity = require('./examples/input.json');
const { prepareData } = require('./build/index.js');

console.log(JSON.stringify(prepareData(entity, { sprintId: 977 }) )); 