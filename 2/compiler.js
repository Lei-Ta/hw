var melody_mus = { 
	tag: 'seq',
	left: { 
		tag: 'par',
		left: { tag: 'note', pitch: 'c3', dur: 250 },
		right: { tag: 'note', pitch: 'g4', dur: 500 }
	},
	right: {
		tag: 'par',
		left: { tag: 'note', pitch: 'd3', dur: 500 },
		right: {
			tag : 'seq',
			left : { tag: 'rest', duration: 250 },
			right: { 
				tag: 'repeat',
				count: 3,
				section: {
					tag: 'par',
					left: { tag: 'note', pitch: 'g4', dur: 500 },
					right: { tag: 'note', pitch: 'c3', dur: 1000 }
				}
			}
		}
	}
};

// Expected result
var expected_result = [
	{ tag: 'note', pitch: 48, start: 0, dur: 250 },		//	c3: 12 + 3 * 12 + 0 = 48
	{ tag: 'note', pitch: 67, start: 0, dur: 500 },		//	g4: 12 + 4 * 12 + 7 = 67
	{ tag: 'note', pitch: 50, start: 500, dur: 500 },	//	d3: 12 + 3 * 12 + 2 = 50
	{ tag: 'rest', start: 500, duration: 250 },
	{ tag: 'note', pitch: 67, start: 750, dur: 500 },	//	g4: 12 + 4 * 12 + 7 = 67
	{ tag: 'note', pitch: 48, start: 750, dur: 1000 },	//	c3: 12 + 3 * 12 + 0 = 48
	{ tag: 'note', pitch: 67, start: 1750, dur: 500 },	//	g4: 12 + 4 * 12 + 7 = 67
	{ tag: 'note', pitch: 48, start: 1750, dur: 1000 },	//	c3: 12 + 3 * 12 + 0 = 48
	{ tag: 'note', pitch: 67, start: 2750, dur: 500 },	//	g4: 12 + 4 * 12 + 7 = 67
	{ tag: 'note', pitch: 48, start: 2750, dur: 1000 }	//	c3: 12 + 3 * 12 + 0 = 48
];


var endTime = function (time, expr) {
	switch (expr.tag){
	case 'note':
		time += expr.dur;
		break;
	case 'rest':
		time += expr.duration;
		break;
	case 'seq':
		time = endTime(time, expr.left);
		time = endTime(time, expr.right);
		break;
	case 'par':
		var time1 = endTime(time, expr.left);
		var time2 = endTime(time, expr.right);
		time = (time1 > time2) ? time1 : time2;
	}
	return time;
};

var compile = function(musexpr){
	return toNotes(0, musexpr);
};

var toNotes = function (time, expr) {
	var list = [];
	switch (expr.tag){
	case 'note':
		list.push(makeTag(time, expr));
		break;
	case 'rest':
		list.push(makeTag(time, expr));
		break;
	case 'seq':
		list = list.concat(toNotes(time, expr.left));
		time = endTime(time, expr.left);
		list = list.concat(toNotes(time, expr.right));
		break;
	case 'par':
		list = list.concat(toNotes(time, expr.left));
		list = list.concat(toNotes(time, expr.right));
		break;
	case 'repeat':
		var x = 1;
		for (var i = 0; i < expr.count; i++){
			list = list.concat(toNotes(time, expr.section));
			time = endTime(time, expr.section);
		}
	}
	return list;
};

var convertPitch = function (pitch){
	var notes = {'c' : 0, 'd': 2, 'e': 4, 'f': 5, 'g': 7, 'a': 9, 'b': 11};
	var note = notes[pitch[0]];
	var octave = parseInt(pitch.slice(1), 10);
	return 12 + octave * 12 + note;
};

var makeTag = function (start, expr){
	var result = {};
	switch (expr.tag){
	case 'note':
		result = {tag: expr.tag, pitch: convertPitch(expr.pitch), start: start, dur: expr.dur};
		break;
	case 'rest':
		result = {tag:expr.tag, start: start, duration: expr.duration};
		break;
	}
	return result;
};

console.log("melody_mus:\n" + JSON.stringify(melody_mus)+"\n");
console.log("expected_result:\n" + JSON.stringify(expected_result)+"\n");
var melody_notes = compile(melody_mus);
console.log("melody_notes:\n" + JSON.stringify(melody_notes)+"\n");