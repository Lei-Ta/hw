MUS parser

- Notes are signed with pitch and duration as c4-500. 

- Rest signed only with duration as -300

- Repeats are defined as 4:, for example 2:c3-100

- Sequential notes are separated by spaces, new lines or comments. 

- Comments start with two semicolons ;; and continue until the end of the line.

- Parallel notes are separated by semicolon.

- Notes can grouped with parens ( )

Example:

4:(c2-200 ; g4-100 a4-100) f2-100

parses to 

{
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
} 
