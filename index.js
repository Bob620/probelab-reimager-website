const aws = require('aws-sdk'),
      kagi = require('kagi'),
      bodyParser = require('body-parser'),
      express = require('expressjs');

const app = express();

app.user(bodyParser.json());

app.get('/', (req, res, next) => {
  // Send htlm/react page
  res.send();
});

app.get('/:miniRL', (req, res, next) => {
  // Redirect to MiniRL
  const miniRL = req.params.miniRL;

  res.redirect(longURL);
});

app.post('/api/createminirl', (req, res, next) => {
  // Create MiniRL and return it
  res.json({miniRL});
});