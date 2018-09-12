
const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const {Ladder} = require('../models/Ladder');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

//Show all ladders
router.get('/', (req, res) => {
    Ladder
        .find()
        .then(ladders => {
            res.json({
              ladders: ladders.map(ladder => ladder.serialize())
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went wrong'});
        });
});

//Show an individual ladder
router.get('/:id', (req, res) => {
  Ladder
    .findById(req.params.id)
    // .populate('rankings.user')
    .then(ladder => res.json(ladder.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

//Create a new ladder
router.post('/', jsonParser, (req, res) => {
    console.log(`req.body is ${req.body}`);
    const requiredFields = ['name', 'gender', 'region'];
    for(let i=0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
  }
  Ladder.create({
    name: req.body.name,
    gender: req.body.gender,
    region: req.body.region,
    rankings: req.body.rankings,
    isActive: req.body.isActive
    
  })
  .then(ladder => res.status(201).json(ladder.serialize()))
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  });
})

//Update a ladder
//updating a ladder would a occur when adding/removing players and when recording successful challenge
router.put('/:id', (req, res) => {
    res.send(`trying to update ${req.params.id}`);
});


//Delete a ladder 
router.delete('/:id', (req, res) => {
    console.log(req.params.id);
    Ladder
    .findByIdAndRemove(req.params.id)
    .then(ladder => res.status(204).end())
    .catch(err => res.status(500).json({message: "Internal server error"}));
  });


module.exports = router;