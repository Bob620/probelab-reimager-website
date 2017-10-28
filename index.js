const aws = require('aws-sdk'),
      kagi = require('kagi'),
      bodyParser = require('body-parser'),
      express = require('expressjs');

const RemoteSet = require('/remoteset.js');

const app = express();
      urls = new RemoteSet({defaultValue: '/404'});

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  // Send html/react page
  res.send('index');
});

app.get('/:miniRL', (req, res, next) => {
  // Redirect to MiniRL
  const miniRL = req.params.miniRL;

  res.redirect(urls.get(miniRL));
});

app.get('/404', (req, res, next) => {
  // Send html 404 page
  res.send('404');
});

// Public assets
app.use('/assets', express.static('/public'))

// API (/api)
app.post('/api/createminirl', (req, res, next) => {
  // Create MiniRL and return it
  res.json({miniRL});
});