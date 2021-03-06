const express = require('express');

const Reddit = require('./src/services/reddit');
const slidesService = require('./src/services/googleSlides');
const createRandomPerson = require('./src/services/createRandomPerson');
const Person = require('./src/entities/Person');
const Slide = require('./src/entities/Slide');

const app = express();

const reddit = new Reddit();

// respond with "hello world" when a GET request is made to the homepage
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/reddit/', function (req, res) {
    res.send(reddit.get());
});

app.get('/reddit/auth', function (req, res) {
    reddit.auth().then(result => res.send(result));
});

app.get('/reddit/r/:sub' , function (req, res) {
    reddit.subreddit(req.params.sub).then(presentation => {
        slidesService.newPresentation(presentation).then((url) => {
            res.send(url);
        });
    });
});

app.get('/reddit/r/:sub/top' , function (req, res) {
    reddit.subreddit(req.params.sub).then(presentation => {
        slidesService.newPresentation(presentation).then((url) => {
            res.send(url);
        });
    });
});

app.get('/reddit/r/:sub/hot' , function (req, res) {
    reddit.subreddit(req.params.sub).then(presentation => {
        slidesService.newPresentation(presentation).then((url) => {
            res.send(url);
        });
    });
});

app.get('/reddit/random' , function (req, res) {
    reddit.random().then(presentation => {
        slidesService.newPresentation(presentation).then((url) => {
            res.send(url);
        });
    });
});

app.get('/reddit/autocomplete', function (req, res) {
    res.send(reddit.autocomplete(req.query.q).then(completions => console.log(completions)));
});

app.get('/person/', function (req, res) {
    res.send(createRandomPerson.get())
});

app.listen(3000, () => console.log('Whackaoke-API listening on port 3000!'))
