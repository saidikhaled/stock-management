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
	console.log(errorsRec);

	const data = [];

	for (let i = 0; i < 20; i++) {
		if (req.body.Reference[i] !== ' ') {
			const newMatiere = {};
			newMatiere.Magasin = req.body.Magasin[i];
			newMatiere.Famille = req.body.Famille[i];
			newMatiere.Reference = req.body.Reference[i];
			newMatiere.Designation = req.body.Designation[i];
			newMatiere.UM = req.body.UM[i];
			newMatiere.Q_Stock = req.body.Q_Stock[i];

			data.push(newMatiere);
		}
	}

	console.log('this is the data array legnth :', data.length);
	// Matiere.collection.insert(data, function (err, docs) {
	// 	if (err) {
	// 		return console.error(err);
	// 	} else {
	// 		console.log('Multiple documents inserted to Collection');
	// 	}
	// });
	//

	// check if there are any errors
	if (errorsRec.length > 0) {
		res.render('reception', {
			errorsRec
		});
	} else {
		res.render('reception');
	}
	// 	const newMatiere = new Matiere({
	// 		Famille,
	// 		Magasin,
	// 		Reference,
	// 		Designation,
	// 		UM,
	// 		Q_Stock
	// 	});
	// 	console.log('this is the content of req body', req.body);
	// 	newMatiere
	// 		.save()
	// 		.then((result) => {
	// 			console.log('this is result after save', result);
	// 			res.redirect('ficheMatiere');
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// }
});
// get by ID
router.get('/:matiereId', (req, res, next) => {
	const id = req.params.matiereId;
	Matiere.findById(id)
		.exec()
		.then((doc) => {
			console.log('From Database : ', doc);
			if (doc) {
				res.status(200).json(doc);
			} else {
				res.status(404).json({
					message : 'No valid entry found for provided ID'
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

router.patch('/', (req, res, next) => {
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}

	Matiere.update(
		{
			Reference : Ref
		},
		{
			$set : updateOps
		}
	)
		.then((result) => {
			console.log(result);
			res.status(201).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error : err
			});
		});
});
// update matiere
function updateMatiere (Ref) {
	Matiere.update(
		{
			Reference : Ref
		},
		{
			$set : Q_Stock
		}
	)
		.then((result) => {
			console.log(result);
			res.status(201).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error : err
			});
		});
}
// search
router.get('/search', (req, res, next) => {
	const q = req.query.search;
	//full text search using $text
	Matiere.find(
		{
			$texr : {
				$search : q
			}
		},
		{ _id: 0, _v: 0 },
		(err, data) => {
			res.json(data);
		}
	);

	//partial text search using regex

	// Matiere.find(
	// 	{
	// 		Reference : {
	// 			$regex : new RegExp(q)
	// 		}
	// 	},
	// 	{ _id: 0, _v: 0 },
	// 	(err, data) => {
	// 		res.json(data);
	// 	}
	// ).limit(10);
});

function escapeRegex (text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

module.exports = router;
