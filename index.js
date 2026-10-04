const express = require('express');
const fs = require('fs').promises;
//moodul URL-i lahtiharutamiseks, et saaks POST osad ka kأ¤tte
const bodyparser = require('body-parser');
const dateET = require('./src/dateTimeET');

const textRef = 'public/txt/vanasonad.txt';
const regTextRef = 'public/txt/visits.txt';

//kأ¤ivitan expess.js funktsiooni ja annan nimeks "app"
const app = express();
//mأ¤أ¤rame veebilehtedele mallide renderdamise mootori
app.set('view engine', 'ejs');
//mأ¤أ¤ran أ¼he pأ¤ris kataloogi virtuaalses serveris kأ¤ttesaadavaks
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: false}))

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

app.listen(5132);