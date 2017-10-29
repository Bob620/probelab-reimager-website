const Random = require('random-js'),
      bodyParser = require('body-parser'),
      express = require('express');

const RemoteSet = require(`${__dirname}/remoteset.js`);

const randomEngine = Random.engines.mt19937().autoSeed();
      app = express();
      urls = new RemoteSet({defaultValue: {url: '/404'}, key: 'minirl', tableName: 'minirl', serial: {
        minirl: ['S'],
        clicks: ['N'],
        created: ['S'],
        url: ['S']
      }});

const minirlCharacters = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM_';
      minirlLength = 6;

async function createMinirl() {
  const minirl = Random.string(minirlCharacters)(randomEngine, minirlLength);
  const item = await urls.get(minirl)
  if (item.minirl === minirl && minirl !== 'assets') {
    return createMinirl();
  }
  return minirl;
}

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  // Send html/react page
  res.sendFile(`${__dirname}/views/index.html`);
});

app.get('/404', (req, res, next) => {
  // Send html 404 page
  res.sendFile(`${__dirname}/views/404.html`);
});

// Public assets
app.use('/assets', express.static(`${__dirname}/public`));

app.get('/:miniRL', async (req, res, next) => {
  // Redirect to MiniRL
  const miniRL = req.params.miniRL;
  if (miniRL !== '[object Promise]' && miniRL !== '404' && miniRL !== 'assets' && miniRL !== 'robots.txt' && miniRL !== 'favicon.ico') {
    const item = await urls.get(miniRL);
    res.redirect(item.url);
  }
});

// API (/api)
app.post('/api/minirl', async (req, res, next) => {
  // Create MiniRL and return it
  let url = req.body.url;
  if (url !== undefined && url.length > 4) {
    if (url.endsWith('/')) {
      url = url.substr(0, -1);
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://'+url;
    }

    try {
      res.json(await urls.find({key: 'url', value: url}));
    } catch(err) {
      const minirl = await createMinirl();
      const item = {
        minirl: minirl,
        url: url,
        clicks: 0,
        created: new Date().toUTCString()
      };
      urls.put(minirl, item);
      res.json(item);
    }
  } else {
    res.json({error: 'Invalid URL'})
  }
});

app.listen(80);