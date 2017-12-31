const express   = require('express'),
    bodyParser  = require('body-parser'),
    cors        = require('cors'),
    morgan      = require('morgan'),
    path        = require('path'),
    http        = require('http');

const apiRoutes = require('./api/routes');

// Express app
const app = express();

// Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Log
app.use(morgan('dev'));

// CORS
app.use(cors());

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', apiRoutes);

// Send all other requests to the Angular app
app.get('/[^\.]+$', (req, res, next) => {
  res.set('Content-Type', 'text/html').sendFile(path.join(__dirname, 'dist/index.html'));
});

// Port
const port = process.env.PORT || '3001';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost: ${port}`));
