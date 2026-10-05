const express = require('express');
const fs = require('fs').promises;
//moodul URL-i lahtiharutamiseks, et saaks POST osad ka kأ¤tte
const bodyparser = require('body-parser');
//moodul andmebaasiga suhtlemiseks, promises osaga async programmeerimise jaoks
const mysql = require('mysql2/promise');
//moodul .env faili lugemiseks, keskonnamuutujate parsimiseks
require('dotenv').config();
const dateET = require('./src/dateTimeET');

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';

//kأ¤ivitan expess.js funktsiooni ja annan nimeks "app"
const app = express();
//mأ¤أ¤rame veebilehtedele mallide renderdamise mootori
app.set('view engine', 'ejs');
//mأ¤أ¤ran أ¼he pأ¤ris kataloogi virtuaalses serveris kأ¤ttesaadavaks
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasiühenduse
/*const conn = mysql.createConnection({
	host: 'localhost',
	user: 'if26',
	password: 'ifikas2',
	database: 'if26_Kristen_Ka_TA'

});*/

//marsruudid
app.get('/', (req, res)=>{
	//res.send('Express.js lأ¤ks kأ¤ima ja serveerib meile veebi.');
	const dayNow = dateET.day();
	const dateNow = dateET.fullDate(0);
	const timeNow = dateET.fullTime();
	res.render('index', {dayNow: dayNow, dateNow: dateNow, timeNow: timeNow});
});

app.get('/tlu', (req, res)=>{
	res.render('tlu');
});

app.get('/vanasona', async (req, res)=>{
	console.log('Pأ¤ringu sisu on: ' + req.body);
	try {
		const data = await fs.readFile(textRef, "utf8");
		let folkWisdom = data.split(";");
		res.render('vanasona', {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]});
	}
	catch (err) {
		console.log(err);
		res.render('vanasona', {wisdom: 'Ei leidnud أ¼htegi vanasأµna!'});
	}
});

app.get('/regvisit', (req, res)=>{
	res.render('regvisit');
});

app.post('/regvisit', async (req, res)=>{
	try {
		const dateNow = dateET.fullDate(0);
		const timeNow = dateET.fullTime();
		await fs.open(regTextRef, 'a');
		await fs.appendFile(regTextRef, req.body.nameInput + ', ' + dateNow + ', ' + timeNow + ';');
		res.render('regvisit');
	}
	catch (err){
		console.log(err);
		res.render('regvisit');
	}
});

app.get('/viimanekulastus', async (req, res) => {
    try {
        const data = await fs.readFile(regTextRef, 'utf8');

        const visits = data.split(';');
        const lastVisit = visits[visits.length - 2];

        const visitParts = lastVisit.split(',');

        res.render('viimanekulastus', {
            name: visitParts[0],
            date: visitParts[1],
            time: visitParts[2]
        });
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/eestifilm', (req, res)=>{
	res.render('eestifilm');
});

app.get('/eestifilm/inimesed', async (req, res)=>{
	console.log('Andmebaasiserver on : ' + process.env.DB_HOST);
	try{
		const conn = await mysql.createConnection({
			host: 'process.env.DB_HOST',
			user: 'process.env.DB_USER',
			password: 'process.env.DB_PASS',
			database: 'process.env.DB_NAME'
		});
		const sqlReq = 'SELECT * FROM person ORDER by last_name';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
		res.render('eestifilmiinimesed', {personList: sqlRes});
	}
	catch(err){
		console.log('Viga adnmebaasist lugemisel: ' + err);
		res.render('eestifilmiinimesed', {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
});

app.get('/eestifilm/inimesed_add', (req, res)=>{
	res.render('eestifilmiinimesed_add' {notice: 'ootan sisestust!'});
});

app.post('/eestifilm/inimesed_add', async (req, res)=>{
	console.log(req.body);
	//kontrollime andmete olemasolu
	if(!req.body.firstNameInput || !req.body.lastNmaeInput || !req.body.bornInput || req.body.bornInput >= new Date()){
		console.log('Andmed pole korrektsed');
		return res.render('eestifilmiinimesed_add');
	}
	try {
		conn = await mysql.createConnection({
			host: 'process.env.DB_HOST',
			user: 'process.env.DB_USER',
			password: 'process.env.DB_PASS',
			database: 'process.env.DB_NAME'
		});
		let sqlReq = 'INSERT INTO person (first_name, last_name, born. deceased) VALUES (?,?,?,?)';
		let deceasedDate = null;
		if(req.req.body.deceasedInput !=''){
			deceasedDate = req.body.deceasedInput;
		}
		await conn.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
			req.body.bornInput,
			deceasedDate
		]);
		res.render('eestifilmiinimesed_add');

	}
	catch (err) {
		console.log('Viga andmebaasiga suhtlemisel: ' + err)
		res.render('eestifilmiinimesed_add', {notice: 'Tekkis vigam andmeid ei salvestatud!'});

	}
	finally {
		if(conn){
			await conn.end();
		}
	}


)};

app.listen(5132);