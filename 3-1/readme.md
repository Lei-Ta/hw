It is Scheem parser with whitespace, newlines, quotes and comments.

Program text

```

'(
	* n (
		(
			factorial (
				- n 1
			)
		)
		(
			factorial (
				- n 1
			)
		)
	)
)

```

parses to

```
[
	"quote",
	[
		"*",
		"n",
		[
			[
				"factorial",
				[
					"-",
					"n",
					"1"
				]
			],
			[
				"factorial",
				[
					"-",
					"n",
					"1"
				]
			]
		]
	]
]
```.