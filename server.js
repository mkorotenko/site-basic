var express = require('express');
var path = require('path');
var send = require('send')

const PORT     = process.env.PORT || 4000
const DIST_DIR = path.join(__dirname, 'dist')
const app = express();

app.get('*.*', express.static(DIST_DIR))
app.get('*', (req, res) => {
    var stream = send(req, "/index.html", { root: path.join(DIST_DIR, req.path) });
    stream.pipe(res);
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
  });
