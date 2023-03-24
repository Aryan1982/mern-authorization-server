const mongoose = require('mongoose')

const Quote = new mongoose.Schema({
	  title: {
	    type: String,
	    required: true
	  },
	  content: {
	    type: String,
	    required: true
	  },
	  createdAt: {
	    type: Date,
	    default: Date.now
	  }
	});

const User = new mongoose.Schema({
	name:{type:String, require:true},
	email:{type:String, require:true, unique:true},
	password:{type:String, require:true},
	quote:[Quote],
},
{
	collection:'user-data'
}
)

const model = mongoose.model('UserData', User)

module.exports = model