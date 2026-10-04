const dateFormattedET = function(opt){
	let timeNow = new Date();
	let monthNamesET = ['jaanuar', 'veebruar', 'mأ¤rts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'];
	if(opt == 1){
		monthNamesET = ['nأ¤أ¤rikuu', 'kأ¼أ¼nlakuu', 'paastukuu', 'jأ¼rikuu', 'lehekuu', 'jaanikuu', 'heinakuu', 'lأµikuskuu', 'mihklikuu', 'viinakuu', 'talvekuu', 'jأµulukuu'];
	}
	return timeNow.getDate() + '. ' + monthNamesET[timeNow.getMonth()] + ' ' + timeNow.getFullYear();
}

const addLeadZero = function(numValue){
	if(numValue < 10){
		numValue = '0' + numValue;
	}
	return numValue;
}

const timeFormattedET = function(){
	let timeNow = new Date();
	let hourNow = timeNow.getHours();
	let minuteNow = timeNow.getMinutes();
	let secondNow = timeNow.getSeconds();
	let timeFormatted = hourNow + ':' + addLeadZero(minuteNow) + ':' + addLeadZero(secondNow);
	return timeFormatted;
}

const weekdayET = function(){
	let weekDay = new Date().getDay();
	const weekdayNamesET = ['pأ¼hapأ¤ev', 'esmaspأ¤ev', "teisipأ¤ev", 'kolmapأ¤ev', 'neljapأ¤ev', 'reede', 'laupأ¤ev'];
	return weekdayNamesET[weekDay];
}

//ekspordin kأµik vajaliku
module.exports = {fullDate: dateFormattedET, fullTime: timeFormattedET, day: weekdayET}