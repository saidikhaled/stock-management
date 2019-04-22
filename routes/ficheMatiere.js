var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

//Matiere model
const Matiere = require('../models/Matiere');

// reception
router.get('/reception', (req, res, next) => {
	console.log(req.query.search);
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Matiere.find({ $or: [ { Magasin: regex }, { Designation: regex } ] })
			.then((docs) => {
				console.log(docs);
				res.render('reception', {
					TM : docs
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error : err
				});
			});
	} else {
		Matiere.find({})
			.then((docs) => {
				console.log(docs);
				res.render('reception', {
					TM : docs
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error : err
				});
			});
	}
});

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

// save new matiere
router.post('/', (req, res) => {
	const data = req.body;
	console.log('the data inside req.body', data);
	const matiere = new Matiere({
		Magasin     : data.Magasin,
		Reference   : data.Reference,
		Designation : data.Designation,
		UM          : data.UM,
		Q_Stock     : data.Q_Stock
	});
	// const matiere = new Matiere({
	//     Magasin: 'B',
	//     Reference: 10230002,
	//     Designation: 'test',
	//     UM: 'M',
	//     Q_Stock: 500
	// });
	matiere
		.save()
		.then((result) => {
			console.log(result);
			res.status(201).json({
				message       : 'Handeling POST requests to /ficheMatiere',
				createMatiere : result
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error : err
			});
		});
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

// update mmatiere
router.patch('/:matiereId', (req, res, next) => {
	const id = req.params.matiereId;
	const updateOps = {};
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Matiere.update(
		{
			_id : id
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
