const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const { Match } = require('../models/match');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

//Show all matches
router.get('/', (req, res) => {
    Match
        .find()
        .populate('defender', 'name')
        .populate('challenger','name')
        .then(matches => {
            res.json({
              matches: matches.map(match => match.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went wrong'});
        });
});

//Show an individual match
router.get('/:id', (req, res) => {
  Match
    .findById(req.params.id)
    .populate('defender', 'name')
    .populate('challenger', 'name')
    .then(match => res.json(match.serialize()))
    .catch(err => {
      console.log(req.params.id);
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

//Create a new match
//matches are created when the challenge is posted
router.post('/', jsonParser, (req, res) => {
    console.log(`req.body is ${req.body}`);
    const requiredFields = ['ladder', 'defender', 'challenger'];
    for(let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
  }
  Match.create({
    ladder: req.body.ladder,
    defender: req.body.defender,
    challenger: req.body.region
    
  })
  .then(match => res.status(201).json(match.serialize()))
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  });
})

//Update a match
//updating a match would a occur when the score is posted.
router.put('/:id', (req, res) => {
    res.send(`trying to update ${req.params.id}`);
});


//Delete a ladder 
router.delete('/:id', (req, res) => {
    console.log(req.params.id);
    Match
    .findByIdAndRemove(req.params.id)
    .then(match => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
  });


module.exports = router;