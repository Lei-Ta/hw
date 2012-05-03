var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('mus.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// Do a test
var string, result, expected;
console.log("\nTests:\n");

//Empty string
string = ""; result = parse(""); expected = "";
console.log(" 1. Empty string");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected); 
console.log("output: " + JSON.stringify(result) + "\n");

//Empty string with new line
string = "\n"; result = parse(string); expected = "";
console.log(" 2. Empty string with new line");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected); 
console.log("output: " + JSON.stringify(result) + "\n");

//Comment without program
string = ";; abcd"; result = parse(string); expected = "";
console.log(" 3. Comment without program");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected );
console.log("output: " + JSON.stringify(result) + "\n");

//Comment without program with new line
string = ";; abcd\n "; result = parse(string); expected = "";
console.log(" 4. Comment without program with new line");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected ); 
console.log("output: " + JSON.stringify(result) + "\n");

//Single note
string = "g4-100"; result = parse(string); expected = {tag:'note', pitch:'g4', dur: '100'};
console.log(" 5. Single note");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected );
console.log("output: " + JSON.stringify(result) + "\n");

//Empty group
string = "()"; result = parse(string); expected = "";
console.log(" 6. Empty group");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected );

//Empty group with extra spaces
string = " ( ) "; result = parse(string); expected = "";
console.log(" 7. Empty group with extra spaces");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected );
console.log("output: " + JSON.stringify(result) + "\n");

//Nepeated note
string = "4:c3-200"; result = parse(string); expected = {tag:'repeat', count:4, section:{tag:'note', pitch:'c3', dur:200}};
console.log(" 8. Repeated note");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected );
console.log("output: " + JSON.stringify(result) + "\n");

//Repeated group
string = "c3-200 c3-200"; result = parse(string); expected = {tag:'seq', left:{tag:'note', pitch:'c3', dur:200}, right:{tag:'note', pitch:'c3', dur:200}};
console.log(" 9. Sequence of notes");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected );	
console.log("output: " + JSON.stringify(result) + "\n");

//Repeated group
string = "4:(c3-200 c3-200)"; result = parse(string); expected = {tag:'repeat', count:4, section:{tag:'seq', left:{tag:'note', pitch:'c3', dur:200}, right:{tag:'note', pitch:'c3', dur:200}}};
console.log("10. Repeated sequence of notes");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected );	
console.log("output: " + JSON.stringify(result) + "\n");

//Repeated note in sequence of notes
string = "4:c3-200 c3-200"; result = parse(string); expected = {tag:'seq', left:{tag:'repeat', count:4, section:{tag:'note', pitch:'c3', dur:200}}, right:{tag:'note', pitch:'c3', dur:200}};
console.log("11. Repeated note in sequence of notes");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected );
console.log("output: " + JSON.stringify(result) + "\n");

//Parallel notes
string = "c3-200;g4-100"; result = parse(string); expected = {tag:'par', left:{tag:'note', pitch:'c3', dur:200}, right:{tag:'note', pitch:'g4', dur:100}};
console.log("12. Parallel notes");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected );
console.log("output: " + JSON.stringify(result) + "\n");

//Sequence with repeated group of parallel notes
string = "4:(c2-200;g4-100 a4-100) f2-100"; result = parse(string); 
expected = {
	"tag":"seq",
	"left":{
		"tag":"repeat",
		"count":"4",
		"section":{
			"tag":"par",
			"left":{
				"tag":"note",
				"pitch":"c2",
				"dur":"200"
			},
			"right":{
				"tag":"seq",
				"left":{
					"tag":"note",
					"pitch":"g4",
					"dur":"100"
				},
				"right":{
					"tag":"note",
					"pitch":"a4",
					"dur":"100"
				}
			}
		}
	},
	"right":{
		"tag":"note",
		"pitch":"f2",
		"dur":"100"
	}
};
console.log("13. Sequence with repeated group of parallel notes");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected ); 
console.log("output: " + JSON.stringify(result) + "\n");

string = "2:(2:g1-100 2:f1-100 2:e1-100 d1-200) 2:c1-100 2:g1-100 2:a2-100 g1-200 2:f1-100 2:e1-100 2:d1-100 c1-200"; 
result = parse(string); 
expected = {
	"tag":"seq",
	"left":{
		"tag":"repeat",
		"count":"2",
		"section":{
			"tag":"seq",
			"left":{
				"tag":"repeat",
				"count":"2",
				"section":{
					"tag":"note",
					"pitch":"g1",
					"dur":"100"
				}
			},
			"right":{
				"tag":"seq",
				"left":{
					"tag":"repeat",
					"count":"2",
					"section":{
						"tag":"note",
						"pitch":"f1",
						"dur":"100"
					}
				},
				"right":{
					"tag":"seq",
					"left":{
						"tag":"repeat",
						"count":"2",
						"section":{
							"tag":"note",
							"pitch":"e1",
							"dur":"100"
						}
					},
					"right":{
						"tag":"note",
						"pitch":"d1",
						"dur":"200"
					}
				}
			}
		}
	},
	"right":{
		"tag":"seq",
		"left":{
			"tag":"repeat",
			"count":"2",
			"section":{
				"tag":"note",
				"pitch":"c1",
				"dur":"100"
			}
		},
		"right":{
			"tag":"seq",
			"left":{
				"tag":"repeat",
				"count":"2",
				"section":{
					"tag":"note",
					"pitch":"g1",
					"dur":"100"
				}
			},
			"right":{
				"tag":"seq",
				"left":{
					"tag":"repeat",
					"count":"2",
					"section":{
						"tag":"note",
						"pitch":"a2",
						"dur":"100"
					}
				},
				"right":{
					"tag":"seq",
					"left":{
						"tag":"note",
						"pitch":"g1",
						"dur":"200"
					},
					"right":{
						"tag":"seq",
						"left":{
							"tag":"repeat",
							"count":"2",
							"section":{
								"tag":"note",
								"pitch":"f1",
								"dur":"100"
							}
						},
						"right":{
							"tag":"seq",
							"left":{
								"tag":"repeat",
								"count":"2",
								"section":{
									"tag":"note",
									"pitch":"e1",
									"dur":"100"
								}
							},
							"right":{
								"tag":"seq",
								"left":{
									"tag":"repeat",
									"count":"2",
									"section":{
										"tag":"note",
										"pitch":"d1",
										"dur":"100"
									}
								},
								"right":{
									"tag":"note",
									"pitch":"c1",
									"dur":"200"
								}
							}
						}
					}
				}
			}
		}
	}
};
console.log("14. Twinkle Star");
console.log("input:  \"" + string + "\"");
assert.deepEqual( result, expected );
console.log("output: " + JSON.stringify(result) + "\n");
