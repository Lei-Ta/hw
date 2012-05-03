var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// Do a test
var string, result, expected;
console.log("Tests:");

//Empty string
string = ""; result = parse(""); expected = "";
console.log(" 1. Empty string");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected); 

//Empty string with new line
string = "\n"; result = parse(string); expected = "";
console.log(" 2. Empty string with new line");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected); 

//Comment without program
string = ";; abcd"; result = parse(string); expected = "";
console.log(" 3. Comment without program");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected );

//Comment without program with new line
string = ";; abcd\n "; result = parse(string); expected = "";
console.log(" 4. Comment without program with new line");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected ); 

//Single atom
string = "abc"; result = parse(string); expected = "abc";
console.log(" 5. Single atom");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result));
assert.deepEqual( result, expected );

//Empty expression
string = "()"; result = parse(string); expected = [];
console.log(" 6. Empty expression");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected );

//Empty expression with extra spaces
string = " ( ) "; result = parse(string); expected = [];
console.log(" 7. Empty expression with extra spaces");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected );

//Quoted atom
string = "'a"; result = parse(string); expected = ["quote", "a"];
console.log(" 8. Quoted atom");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected );

//Quoted expression
string = "'( a b c )"; result = parse(string); expected = ["quote", ["a", "b", "c"]];
console.log(" 9. Quoted expression");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected );	

//Quoted atom in expression
string = "('a b c)"; result = parse(string); expected = [["quote", "a"], "b", "c"];
console.log("10. Quoted atom in expression");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected );

//complex quoted expression
string = "'(* n (factorial (- n 1)))"; result = parse(string); expected = ["quote", ["*", "n", ["factorial", ["-", "n", "1"] ] ] ];
console.log("11. Complex quoted expression");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected ); 

//complex expression with new lines and spaces
string = "\n'(\n  * n (\n    factorial (\n      - n 1\n    )\n  )\n)"; result = parse(string); expected = ["quote", ["*", "n", ["factorial", ["-", "n", "1"] ] ] ];
console.log("12. Complex expression with new lines and spaces");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected ); 

string = "\n'(\n  * n (\n    (\n      factorial (\n      - n 1\n      )\n    )\n    (\n      factorial (\n      - n 1\n      )\n    )\n  )\n)\n"; result = parse(string); expected =  [ "quote", [ "*", "n", [ ["factorial", [ "-", "n", "1" ] ], ["factorial", [ "-", "n", "1" ] ] ] ] ];
console.log("13. Complex expression with new lines and spaces");
console.log("input:  \"" + string + "\"");
console.log("output: " + JSON.stringify(result) + "\n");
assert.deepEqual( result, expected );