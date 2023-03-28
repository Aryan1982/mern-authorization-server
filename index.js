const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/usermodel')
const jwt = require('jsonwebtoken')
const app = express();
require('dotenv').config();
app.use(cors())
app.use(express.json())
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI)


app.post("/api/register",async(req,res)=>{
	// console.log(req.body)

	try{
		const user = await User.create({
			name: req.body.name,
			email:req.body.email,
			password: req.body.password,
			// quote:{title:'hey',content:'heylo'}
		})
		res.json({status:'ok'})
		// console.log(user)
	} catch(err){
		res.json({status:'error', error:'Duplicate email'})
	}
})

	app.post('/api/newquote',async(req,res)=>{
		const token = req.headers.authorization
		const decode = jwt.verify(token, 'secret123');
		const userId = decode.email
		// console.log(decode.email)
		const user=	await User.findOne({email:userId});
		const newQuote = {
	        title:req.body.title,
			content:req.body.content
	    };
	    // console.log(req)
	    user.quote.push(newQuote);
	    await user.save(); 
		
		// console.log(req.headers.authorization)
	})

	app.get('/api/quotes',async(req,res)=>{
		const token = req.headers.authorization
		// console.log(token)
		if(token){
			const decode = jwt.verify(token, 'secret123');
			// console.log(decode)
			res.send(decode)
		}						
	})

	app.post('/api/delete',async(req,res)=>{
		const token = req.headers.authorization
		const decode = jwt.verify(token, 'secret123');
		const userEmail = decode.email
		const user=	await User.findOne({email:userEmail});

		const userID = user._id.toString()
		const quoteID = req.body.quoteid
		// console.log(user._id.toString())
		// console.log(quoteID)
	// 	const userId = "641db6f52818dfa5a4f0b8db"; 
	// 	const quoteId = "641dd7d7038681118e2d8ff3";

	// 	// console.log(req.body.quoteid);

		User.updateOne(
	  	{ _id: userID },
	  	{ $pull: { quote: { _id: quoteID } } }
		).then(console.log('deleted'))
	})

	app.get('/api/allquotes',async(req,res)=>{
		const token = req.headers.authorization
		// console.log(token)
		if(token){
			const decode = jwt.verify(token, 'secret123');
			const user = User.findOne({email:decode.email}).then(function(user){
				res.json(user.quote)
		})
		}
		
		// console.log(user)
		// const data = User.find()
		// const entries = Object.keys(data)
		// res.send(data['schema'].obj.quote)
	})

	app.post("/api/login",async(req,res)=>{
		
	
	const user = await User.findOne({
			email:req.body.email,
			password: req.body.password,
		})

	if(user){
		
		const token = jwt.sign(
		{
			name:user.name,
			email:req.body.email,
		},'secret123')
				// return res.json({status:'ok', user: token})
		// console.log(req.headers)
		 res.json({accessToken: token});
		// localStorage.setItem('token', accessToken);
		// window.location.href='/dashboard'
		// res.render('/register');
	} else{
		res.json({status:'error', user:false})
	}
})

// app.get("/quotes",async(req,res,next)=>{
// 	res.send(req.headers)
// 	console.log(req.header['authorization'])
// })


const PORT = 5000;
app.listen(PORT,(req,res)=>{
	console.log(`app running on port ${PORT}`)
})