const express = require('express')
const bodyParser = require('body-parser') // 引用程序包

const app = express()
app.use(express.static('dist'))
app.use(bodyParser.json()) // bodyParser.json()创建中间件 并用 app.use()在应用层应用它
app.listen(8800, function () {
  console.log('App started on port 8800')
})
