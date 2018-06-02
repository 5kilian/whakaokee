const express = require('express');

const Reddit = require('./src/services/reddit');
const slides = require('./src/services/googleSlides');
const createRandomPerson = require('./src/services/createRandomPerson');
const Person = require('./src/entities/Person');
const Slide = require('./src/entities/slide');

const app = express();

const reddit = new Reddit();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {

});

app.get('/reddit/', function (req, res) {
    res.send(reddit.get());
});

app.get('/reddit/auth', function (req, res) {
    res.send(reddit.auth());
});

app.get('/reddit/r/:sub' , function (req, res) {
    res.send(reddit.subreddit(req.params.sub).then(slides => console.log(slides)));
});

app.get('/reddit/random' , function (req, res) {
    reddit.subreddit('random').then(slides => {
        res.send(slidesService.newPresentation(slides));
    });
});

app.get('/reddit/autocomplete', function (req, res) {
    res.send(reddit.autocomplete(req.query.q).then(completions => console.log(completions)));
});

app.get('/slides/', function (req, res) {
    res.send(slides.newPresentation())
});

app.get('/person/', function (req, res) {
    res.send(createRandomPerson.get())
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
