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
        .then(docs => {
            console.log(docs);
            res.render('ficheMatiere', {
                TM: docs
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

// save new matiere
router.post('/', (req, res) => {
    const data = req.body;
    console.log("the data inside req.body", data);
    const matiere = new Matiere({
        Magasin: data.Magasin,
        Reference: data.Reference,
        Designation: data.Designation,
        UM: data.UM,
        Q_Stock: data.Q_Stock
    });
    // const matiere = new Matiere({
    //     Magasin: 'B',
    //     Reference: 10230002,
    //     Designation: 'test',
    //     UM: 'M',
    //     Q_Stock: 500
    // });
    matiere.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handeling POST requests to /ficheMatiere",
                createMatiere: result
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });
});


// get by ID
router.get("/:matiereId", (req, res, next) => {
    const id = req.params.matiereId;
    Matiere.findById(id)
        .exec()
        .then(doc => {
            console.log("From Database : ", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
})

// update mmatiere
router.patch("/:matiereId", (req, res, next) => {
    const id = req.params.matiereId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Matiere.update({
            _id: id
        }, {
            $set: updateOps
        })
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
})


module.exports = router;