const express   = require('express'),
    bodyParser  = require('body-parser'),
    cors        = require('cors'),
    morgan      = require('morgan'),
    path        = require('path'),
    http        = require('http');

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

// Send all other requests to the Angular app
app.get('/[^\.]+$', (req, res, next) => {
    res.set('Content-Type', 'text/html').sendFile(path.join(__dirname, 'dist/index.html'));
});

// Error handaling
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
  
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost: ${port}`));