var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

//Matiere model
const Matiere = require('../models/Matiere');

// reception

// get render fiche matiere
router.get('/', (req, res) => {
	Matiere.find({})
		.then((docs) => {
			console.log(docs);
			if (docs.Magasin !== null) {
				res.render('ficheMatiere', {
					TM : docs
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error : err
			});
		});
});

// get reception
router.get('/reception', (req, res) => {
	res.render('reception');
});

// save new matiere
// post reception
router.post('/reception', (req, res) => {
	const { Famille, Magasin, Reference, Designation, UM, Q_Stock } = req.body;
	let errorsRec = [];

	//cheking for errors
	for (let i = 0; i < 20; i++) {
		if (req.body.Reference[i] !== ' ') {
			//cheking if there is an empty field
			if (!Famille[i] || !Magasin[i] || !Reference[i] || !Designation[i] || !UM[i] || !Q_Stock[i]) {
				console.log('please fill in all the fields');
				errorsRec.push({
					msg : 'please fill in all the fields'
				});
			}
			// check the length of Reference
			if (Reference[i].length < 8) {
				console.log('Reference should be 8 numbers');
				errorsRec.push({
					msg : 'Reference should be 8 numbers'
				});
			}
		}
	}

	const data = [];

	// insert the data from the Form to an array
	for (let i = 0; i < 20; i++) {
		if (req.body.Reference[i] !== ' ') {
			const newMatiere = {};
			newMatiere.Magasin = req.body.Magasin[i];
			newMatiere.Famille = req.body.Famille[i];
			newMatiere.Reference = req.body.Reference[i];
			newMatiere.Designation = req.body.Designation[i];
			newMatiere.UM = req.body.UM[i];
			newMatiere.Q_Stock = parseInt(req.body.Q_Stock[i], 10);

			data.push(newMatiere);
		}
	}

	// update the existing Matiere and upsert the not existing
	for (let i = 0; i < data.length; i++) {
		updateFunctionR(Matiere, (dt = data[i]));
	}

	// check if there were any errors then rendering
	if (errorsRec.length > 0) {
		res.render('reception', {
			errorsRec
		});
	} else {
		res.render('reception');
	}
});

//get sortie
router.get('/sortie', (req, res) => {
	res.render('sortie');
});

// post sortie
router.post('/sortie', (req, res) => {
	const data = [];

	// insert the data from the Form to an array
	for (let i = 0; i < 20; i++) {
		if (req.body.Reference[i] !== ' ') {
			const newMatiere = {};
			newMatiere.Magasin = req.body.Magasin[i];
			newMatiere.Reference = req.body.Reference[i];
			newMatiere.Designation = req.body.Designation[i];
			newMatiere.Q_Stock = -parseInt(req.body.Q_Stock[i], 10);

			data.push(newMatiere);
		}
	}
	console.log(data[0].Q_Stock);
	console.log(data);
	for (let i = 0; i < data.length; i++) {
		updateFunctionS(Matiere, (dt = data[i]));
	}
	res.render('sortie');
});

// search
router.get('/search', (req, res, next) => {
	const q = req.query.search;
	//full text search using $text
	Matiere.find(
		{
			$text : {
				$search : q
			}
		},
		{ _id: 0, _v: 0 },
		(err, data) => {
			res.render('reception', { data });
		}
	);
});

function escapeRegex (text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function updateFunctionR (model, dt) {
	let query = { Reference: dt.Reference },
		update = {
			$inc : { Q_Stock: dt.Q_Stock },
			$set : {
				Magasin     : dt.Magasin,
				Famille     : dt.Famille,
				Designation : dt.Designation,
				UM          : dt.UM
			}
		},
		options = { upsert: true, new: true, setDefaultsOnInsert: true };

	// Find the document
	model.findOneAndUpdate(query, update, options, function (error, result) {
		if (error) return;

		//console.log('from inside the update  \n result : ' + result);
	});
}
function updateFunctionS (model, dt) {
	let query = { Reference: dt.Reference },
		update = {
			$inc : { Q_Stock: dt.Q_Stock }
		},
		options = { upsert: true, new: true, setDefaultsOnInsert: true };

	// Find the document
	model.findOneAndUpdate(query, update, options, function (error, result) {
		if (error) return;

		//console.log('from inside the update  \n result : ' + result);
	});
}

module.exports = router;
