/**
 * Internal Class to represent Google Slide Text
 * 
 * use this.content_id to refer to the ID
 * 
 */

const gSlideText = require('../entities/gSlideText');
const gSlideImage = require('../entities/gSlideImage');

module.exports = class randomUserSlide {

    /**
     * @param {Person} generatedPerson 
     * @param {string} pageId 
     */
    constructor(randomPersonPromise) {
        console.log('whackson',
            randomPersonPromise
        );
        randomPersonPromise.then(person => {
            this.forname = person.forname;
            this.surname = person.surname;
            this.city = person.city;
            this.username = person.username;
            this.photo = person.photo;
    
            this.pageId = "p0000";
        })
        
        
    }


    /**
     * get the google slide API compatible request objects
     */
    getObject() {
        var randomPersSlide = [ ];

        randomPersSlide = randomPersSlide.concat(
            new gSlideText(100,100, 200, 50,"Hey my Name is" + this.forname + this.surname, this.pageId));
        randomPersSlide = randomPersSlide.concat(    
            new gSlideText(100, 100, 200, 100,"I'm " + Math.floor(Math.random() * 70) + 20, this.pageId));
        randomPersSlide = randomPersSlide.concat(    
            new gSlideText(100,100, 200, 150,"I'm from " + this.city, this.pageId));
        randomPersSlide = randomPersSlide.concat(     
            new gSlideText(100,100, 200, 200,"I'm a farmer", this.pageId));
        randomPersSlide = randomPersSlide.concat(     
            new gSlideImage(100,100, 300, 30, this.phot, this.pageId));
        
        return randomPersSlide;
    }


}

