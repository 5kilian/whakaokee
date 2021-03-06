/**
 * Reddit subpart
 */

const request = require('request');
const fs = require('fs');

const Slide = require('../entities/Slide');
const Presentation = require('../entities/Presentation');

const reddit = 'https://www.reddit.com';
// const reddit_oauth = 'https://oauth.reddit.com';

module.exports = class Reddit {
    get () {
        return 'Hello Reddit!';
    }
    auth () {
        return new Promise((resolve, reject) => request.post({
                url: reddit + '/api/v1/access_token?grant_type=password&username=whackaoke&password=whackathon2k18',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Authorization': 'Basic S3JkWnVnX2hfRkRkbnc6NkhNQjJLN18xRDhTX29pMXZQRUhrdTZSbkpn'
                }
            }, (error, response, body) => {
                fs.writeFile('auth/reddit/credentials.json', body, (err) => { });
                resolve(JSON.parse(body));
            }
        ));
    }
    top (sub) {
        return new Promise((resolve, reject) => {
            request(reddit + '/r/' + sub + '/top.json', (error, response, body) => {
                resolve(Promise.all(JSON.parse(body).data.children.map(child => this.createSlide(child.data))));
            });
        });
    }
    subreddit (sub) {
        let presentation = new Presentation();
        return new Promise((resolve, reject) => {
            request(reddit + '/r/' + sub + '.json', (error, response, body) => {
                request(reddit + '/r/' + JSON.parse(body).data.children[0].data.subreddit + '/about.json', (error, response, suby) => {
                    new Promise((resolve, reject) => {
                        resolve(Promise.all(JSON.parse(body).data.children.map(child => {
                            presentation.slides.push(child.data);
                            return this.createSlide(child.data)
                        })));
                    }).then(slides => {
                        presentation.subreddit = JSON.parse(suby);
                        presentation.slides = slides;
                        setTimeout(() => {
                            resolve(presentation);
                        }, 500);
                    });
                })
            });
        });
    }
    random () {
        let presentation = new Presentation();
        presentation.slides = [];
        return new Promise((resolve, reject) => {
            request(reddit + '/r/random/about.json', (error, response, suby) => {
                Array.apply(null, { length: 20 }).map(Number.call, () => {
                    return new Promise((resolve) => request(reddit + '/r/random/top.json', (error, response, body) => {
                        resolve(this.createSlide(JSON.parse(body).data.children[ 0 ].data));
                    })).then(slide => {
                        presentation.subreddit = JSON.parse(suby);
                        presentation.slides.push(slide);
                        setTimeout(() => {
                            resolve(presentation);
                        }, 1500);
                    });
                })
            })
        });
    }
    autocomplete (query) {
        return new Promise((resolve, reject) => {
            request(reddit + '/api/subreddit_autocomplete_v2.json?query=' + query, (error, response, body) => {
                resolve(JSON.parse(body).data.children.map(child => child.data));
            });
        });
    }
    createTitleSlide (html) {
        let slide = new Slide();
        slide.layout = 'TITLE';
        return slide;
    }
    createSlide (child) {
        return new Promise((resolve, reject) =>
            request(reddit + '/r/' + child.subreddit + '/comments/' + child.id + '.json', (error, response, body) => {
                let slide = new Slide();
                slide.title = child.title;
                slide.content.text = JSON.parse(body)[0].data.children[0].data.selftext;
                slide.content.comments = JSON.parse(body)[1].data.children.map(comment => comment.data.body);
                slide.content.img = /(.*[.](jpg|jpeg|png|gif)$)/.exec(child.url);
                if (slide.content.img) {
                    slide.content.img = slide.content.img[0];
                }

                slide.author.name = child.author;
                resolve(slide);
            })
        );
    }
};
