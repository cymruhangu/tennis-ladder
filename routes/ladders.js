
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
    .then(ladder => res.json(ladder.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

//Create a new ladder
router.post('/', jsonParser, (req, res) => {
    console.log(req.body);
    const requiredFields = [ 'gender', 'region'];
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

//UPDATE LADDER
//updating a ladder would a occur when adding/removing players and when recording successful challenge
//If it's a new player simply push to end of rankings array.  rank = array.length + 1
//If it's a challenge or shuffle the rankings array would have to 
router.put('/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {  //if they both are not undefined and are equal
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  
  //Replace the entire rankings array
    const toUpdate = {};
    const updateableFields = ["name", "region", "rankings", "minAge", "isActive"];

    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //If new player then push to end of ladder
    //If rankings update: $pull challenger then $push challenger @ $position indexOf(defender)
    if(req.body.new){
      //push "new" id to the rankings array
      const newID = req.body.new;
      console.log(newID);
      Ladder
      .findByIdAndUpdate(req.params.id, 
        {$push: {rankings: newID}})
        .then(ladder => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error" }));
    }else if(req.body.defender){
      console.log("INTO ELSE IF");
      const defID = req.body.defender;
      const chalID = req.body.challenger;
      Ladder
      .findByIdAndUpdate(req.params.id,
        {$pull: {rankings: chalID}})
        .then(ladder => {
            const defIndex = ladder.rankings.indexOf(defID.toString());
            console.log(`defIndex = ${defIndex}`);
            Ladder.findByIdAndUpdate(ladder.id, 
                {$push: {rankings:{$each: [chalID], $position: defIndex}} })
                .then(ladder => res.status(204).end())
            })
        .catch(err => res.status(500).json({ message: "Internal server error" }));
    } else{
      console.log("INTO THE ELSE");
    //-----
        Ladder
        .findByIdAndUpdate(req.params.id, {$set: toUpdate})
        .then(ladder => res.status(204).end())
        .catch(err => res.status(500).json({ message: "Internal server error" }));
    }
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