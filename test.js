const entity = require('./examples/input.json');
const { prepareData } = require('./src/index.js');

console.log(JSON.stringify(prepareData(entity, { sprintId: 977 })));
