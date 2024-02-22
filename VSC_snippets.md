# VSC Snippets

To have a better experience with the VSC, you can define the following snippets:

```json
{
	// Placeholder $1 OR ${1:label} where label is a default value
	// Placeholder list of values ${1|label1, label2, label3|}:
	"my2dE: Create Scene": {
		"scope": "typescript",
		"prefix": "mys",
		"body": [
			"export class ${1:SceneName} extends Scene {",
			"",
			"	constructor() {",
			"		super()",
			" 	}",
			"",
			"	async init() {"
			"		$2"
			"	}",
			"",
			"	update(dt: number): void {" ,
			"		$3",
			"	}",
			"",
			"	onExit(): void {",
			"		$4",
			"	}",
			"",
			"}",
		],
		"description": "Create a game scene"
	},
	"my2dE: Create GameObject": {
		"scope": "typescript",
		"prefix": "myg",
		"body": [
			"@Entity()",
			"export class ${1:GameObjectName} extends GameObject {",
			"",
			"	constructor(${2:name}: string, ${3:spriteName}: string) {",
			"		super(${4:name})",
			" 	}",
			"",
			"}",
		],
		"description": "Create a game entity"
	}
}
```

For a complete list of all the variables that you can use in the snippets, see the [official documentation](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax). and [variables](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_variables).

[back](./README.md#Features)
