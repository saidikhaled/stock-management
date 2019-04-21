var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

//Matiere model
const Matiere = require('../models/Matiere');

// get
router.get('/', (req, res) => {
    let posts = [{
            title: 'Post 1',
            name: 'Danny'
        },
        {
            title: 'Post 2',
            name: 'Alex'
        },
        {
            title: 'Post 3',
            name: 'Matt'
        },
        {
            title: 'Post 4',
            name: 'Manny'
        }
    ];

    Matiere.find({})
        .then((matiere) => {
            console.log(matiere);
            res.render('ficheMatiere', {
                TM: matiere
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.post('/', (req, res) => {
    const matiere = new Matiere({
        Magasin: 'B',
        Reference: 10230002,
        Designation: 'test',
        UM: 'M',
        Q_Stock: 500
    });
    matiere.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handeling POST requests to /ficheMatiere",
                createMatiere: matiere
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });
});

router.get("/:matiereId", (req, res, next) => {
    const id = req.params.matiereId;
    Matiere.findById(id)
        .exec()
        .then(doc => {
            console.log("From Database : ", doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
})
module.exports = router;