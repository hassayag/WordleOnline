const express = require('express');
const app = express();
var cors = require('cors');
const port = 8081;
const words = require('./routes/words');

app.use(cors())

app.use('/words', words);

app.listen(port, () => {
  console.log(`Wordle API listening on port ${port}`);
})
