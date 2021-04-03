const entity = require('./examples/input.json');
const {prepareData} = require('./build/index.js');

console.log(prepareData)

console.log(prepareData(entity, { sprintId: 977 })); 