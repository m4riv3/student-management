const express = require('express');
const Router = express.Router();
const bodyparser = require('body-parser')
Router.use(bodyparser.urlencoded({ extended: true }));
Router.use(bodyparser.json());
const User = require('../User');
Router.get('/', (req, res) => {
    User.find({},(err, result) => {
        if (err) {
           return res.status(404).send(`Error ${err}`);
        }
        else {

            return res.status(200).send(result)
        }
    })
})
Router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, result) => {
        if (err) return res.sendStatus(404);
        else return res.status(200).send(result);
    })
})
Router.post('/', (req, res) => {
    const id = req.body._id;
    User.create({
        '_id':id,
        'name' : req.body.name,
        'score': req.body.score,
        'studentID': req.body.studentID
    })
        .then(result => {
            console.log('create user success');
            return res.send({message:`Add ${req.body.name} success`});
        })
        .catch(err => {
            console.log('err' + JSON.stringify(err));
            return res.send(JSON.stringify(err));
    })
})

// Router.delete('/:id', (req, res) => {
//     User.deleteOne({ _id: req.params.id }, (err, result) => {
//         if (err) console.log(err);
//         else return res.status(200).send({ message: `Delete ${req.params.id} success`});
//     })
// });

Router.delete('/deletAll', (req, res) => {
    User.deleteMany({}, (err, result) => {
        if (err) throw err;
        else res.send(200, 'Delete OK');
    })
})
Router.put('/:id', (req, res) => {
    User.findById(req.params.id, (err, result) => {
        if (err)return res.sendStatus(404);
        else {
            if (req.body.name) User.findByIdAndUpdate(req.params.id, { name: req.body.name });
            if (req.body.score) User.findByIdAndUpdate(req.params.id, { score: req.body.score });
            if (req.body.studentID) User.findByIdAndUpdate(req.params.id, { studentID: req.body.studentID });
            return res.status(200).send({message:'PUT ok'})
        }
    })
})
module.exports = Router;