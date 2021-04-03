const entity = require('./examples/input.json');
const {prepareData} = require('./build/index.js');

console.log(typeof prepareData(entity, { sprintId: 977 })); 