import express from 'express';
import path from 'path';

const app = express();
app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(5000, () => console.log('server listening on port 5000'));
