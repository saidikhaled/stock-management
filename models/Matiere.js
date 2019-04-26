const mongoose = require('mongoose');

const MatiereSchema = new mongoose.Schema({
	Magasin         : {
		type     : String,
		required : true,
		trim     : true
	},
	Reference       : {
		type     : String,
		required : true,
		unique   : true,
		trim     : true
	},
	Designation     : {
		type     : String,
		required : true,
		trim     : true
	},
	Famille         : {
		type     : String,
		required : true,
		trim     : true
	},
	UM              : {
		type : String,
		trim : true
	},
	Ref_fournisseur : {
		type : String,
		trim : true
	},
	Q_Stock         : {
		type     : Number,
		required : true,
		min      : 0
	},
	PUMP            : {
		type : Number
	},
	Valeur          : {
		type : Number
	}
});

const Matiere = mongoose.model('Matiere', MatiereSchema);

module.exports = Matiere;
