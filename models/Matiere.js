const mongoose = require('mongoose');

const MatiereSchema = new mongoose.Schema({
	Magasin         : {
		type : String
	},
	Reference       : {
		type : Number
	},
	Designation     : {
		type : String
	},
	UM              : {
		type : String
	},
	Ref_fournisseur : {
		type : String
	},
	Q_Stock         : {
		type : Number,
		min  : 0
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
