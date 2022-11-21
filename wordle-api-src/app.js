const express = require('express');
const app = express();
const port = 8080;
const words = require('./routes/words');

app.use('/words', words);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
