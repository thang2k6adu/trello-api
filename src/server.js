const express = require('express')
const app = express()

const hostname = 'localhost'
const port = 8017

app.get('/', function (req, res) {
  res.send('<h6>hello world</h6>')
})

app.listen(port, hostname, () => {
  console.log(`HELLO THANG DEP CHAI, http://${hostname}:${port}}`)
})