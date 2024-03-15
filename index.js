require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
var urls = [];

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

function stringIsAValidUrl(url) {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
}

app.post('/api/shorturl/', function(req, res) {
  const { url } = req.body;

  if (!stringIsAValidUrl(url)) {
    return res.json({ error: 'invalid url' });
  }
    const customURL = {
      original_url: url,
      short_url: urls.length,
    };
    urls.push(customURL);
    res.json(customURL);
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const short_url = +req.params.short_url;
  const findURL = urls.find(url => url.short_url === short_url);
  if (findURL) {
   return res.redirect(findURL.original_url);
  }
  return res.status(404).json({ error: 'Short URL not found' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
