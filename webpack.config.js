const path = require('path'); // подключаем path к конфигу вебпак

module.exports = {
  entry: './src/index.js',
  output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'index.js'
  }
}