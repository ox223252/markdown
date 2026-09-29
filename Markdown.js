export default class Markdown {
	constructor ( params )
	{
	}

	parse ( txt = "" )
	{
		this.data = Markdown._parse ( txt );

		this.data.map ( d=>Markdown._convertToHtml ( d ) )
	}

	get html ( )
	{

	}

	get txt ( )
	{

	}

	get md ( )
	{
		return this.data.map ( d=>d.found?.[ 0 ] ?? d.t ).join ( "" );
	}

	get html ( )
	{
		let html = this.data.map ( d=>d.html ).filter ( f=>f );

		let p = undefined;
		for ( let [index,item] of html.entries ( ) )
		{
			switch ( item.localName )
			{
				default:
				{
					p = undefined;
					break;
				}
				case "a":
				case "span":
				{
					let n = false;
					if ( !p )
					{
						p = document.createElement ( "p" );
						n = true;
					}

					p.appendChild ( item );

					html[ index ] = (n)?p:undefined;

					break;
				}
			}
		}

		return html.filter ( f=>f );
	}

	static get regex ( )
	{
		return [
			{
				type:"title",
				r:/(#+)([^\n]*)\n/,
				check: 2,
			},
			{
				type:"image",
				r:/\s*!\[([^\]]+)\]\(([^\)\s]+)( "([^\)\s]+)")?( (=\d+x\w+))?\)\s*/,
				check: false,
			},
			{
				type:"link",
				r:/\s*\[([^\]]+)\]\(([^\)\s]+)\)\s*/,
				check: false,
			},
			{
				type:"list",
				r:/((\s*)-([^-][^\n]*)([\s\n$])?)+/,
				check: undefined,
				fnct: (txt)=>{
					return txt.split ( "\n" )
						.filter ( f=>f.trim ( ) )
						.map ( t2=>t2.split( "-" )[ 1 ] )
						.map ( cell=>Markdown._parse ( cell.trim ( ) ) ?? cell )
				}
			},
			{
				type:"checkbox",
				r:/\s*\[([\sx]?)\]/,
				check: false,
			},
			{
				type: "line",
				r: /^---+(\s|\n|$)/,
				check: false,
			},
			{
				type: "bold",
				r: /\*\*([^(\*\*)]+)\*\*/,
				check: 1,
			},
			{
				type: "italic",
				r: /\_([^_]+)\_/,
				check: 1,
			},
			{
				type: "del",
				r: /~~([^(~~)]+)~~/,
				check: 1,
			},
			{
				type: "mono",
				r: /`([^`]+)`/,
				check: 1,
			},
			{
				type:"cite",
				r:/>([^\n]+)\n/,
				check: 1,
			},
			{
				type:"table",
				r:/^(\s*\|.*\|\s*\n?)+/,
				fnct: (txt)=>{
					return txt.split ( "\n" )
						.filter ( line=>line.trim ( ) )
						.map ( line=>line.split ( "|" )
							.filter ( cell=>cell.trim ( ) )
							.map ( cell=>Markdown._parse ( cell.trim ( ) ) ?? cell )
						)
				},
				check: false,
			}
		];
	}

	static _convertToHtml ( el )
	{
		switch ( el?.type )
		{
			case "text":
			{
				el.html = document.createElement ( "span" );
				el.html.innerText = el.t;
				break;
			}
			case "title":
			{
				let lvl = el.found[ 1 ].length ?? 6;
				let txt = el.found[ 2 ] ?? "";

				el.html = document.createElement ( `h${lvl}` );
				el.html.innerText = txt;
				break;
			}
			case "image":
			{
				let src = el.found[ 2 ]
				let width = el.found[ 6 ]
					?.replace ( "=" ,"" )
					?.split ( "x" )
					?.[ 0 ];
				let heigth = el.found[ 6 ]
					?.replace ( "=" ,"" )
					?.split ( "x" )
					?.[ 1 ];

				el.html = document.createElement ( "img" );
				el.html.src = src;

				if ( width )
				{
					width += "px";
					el.html.style.width = width;
				}

				if ( heigth )
				{
					heigth += "px";
					el.html.style.heigth = heigth;
				}
				break;
			}
			case "link":
			{
				let txt = el.found[ 1 ];
				let href = el.found[ 2 ];

				el.html = document.createElement ( "a" );
				el.html.href = href;
				el.html.innerText = txt;
				break;
			}
			case "list":
			{
				el.html = document.createElement ( "ul" );

				for ( let line of el.content )
				{
					for ( let item of line )
					{
						Markdown._convertToHtml ( item );
					}

					let li = document.createElement ( "li" );
					el.html.appendChild ( li );

					line.map ( item=>item.html )
						.filter ( f=>f )
						.map ( html=>li.appendChild ( html ) );
				}
				break;
			}
			case "checkbox":
			{
				let checked = !!el.found[ 1 ].trim ( );

				el.html = document.createElement ( "input" );
				el.html.type = "checkbox";
				el.html.disabled = true;
				el.html.checked = checked;
				break;
			}
			case  "line":
			{

				el.html = document.createElement ( "hr" );
				break;
			}
			case "table":
			{
				console.log ( el );
				el.html = document.createElement ( "table" );

				for ( let [index,line] of el.content.entries ( ) )
				{
					let tr = document.createElement ( "tr" );
					el.html.appendChild ( tr );

					if ( 1 == index )
					{
						// console.log ( line );
						continue;
					}

					for ( let cell of line )
					{
						let td = document.createElement ( "td" );
						tr.appendChild ( td );

						for ( let item of cell )
						{
							Markdown._convertToHtml ( item );
						}

						cell.map ( item=>item.html )
							.filter ( f=>f )
							.map ( html=>td.appendChild ( html ) );
					}
				}
				break;
			}
			case  "bold":
			{
				let txt = el.found[ 1 ]

				el.html = document.createElement ( "b" );
				el.html.innerText = txt;
				break;
			}
			case  "italic":
			{
				let txt = el.found[ 1 ]

				el.html = document.createElement ( "i" );
				el.html.innerText = txt;
				break;
			}
			case "del":
			{
				let txt = el.found[ 1 ]

				el.html = document.createElement ( "s" );
				el.html.innerText = txt;
				break;
			}
			case  "mono":
			{
				let txt = el.found[ 1 ]

				el.html = document.createElement ( "code" );
				el.html.innerText = txt;
				break;
			}
			case "cite":
			{
				let txt = el.found[ 1 ]

				el.html = document.createElement ( "cite" );
				el.html.innerText = txt;
				break;
			}
		}
	}

	static _parse ( txt )
	{
		let found = [];

		let i = 0;
		while ( txt )
		{
			let obj = {};

			let f = Markdown._searchRegex ( Markdown.regex, txt );

			if ( !f
				|| f?.found?.index )
			{
				found.push ({
					type:"text",
					t: ( f?.found?.index )
						?txt.substring ( 0, f.found.index )
						:txt,
				})

				if ( !f )
				{
					break;
				}
			}

			txt = txt.substring ( f.found.index + f.found[ 0 ].length );
			found.push ( f );
		}

		found
			.filter ( f=>f.found )
			.filter ( f=>f.fnct )
			.filter ( f=>{
				f.content = f.fnct( f.found[ 0 ] )
			})

		found
			.filter ( f=>f.found )
			.filter ( f=>f.check )
			.map ( f=>{
				f.content = Markdown._parse ( f.found[ f.check ] );
			})

		return found;
	}

	static _searchRegex ( regex, txt )
	{
		let found = [];

		for ( let r of regex )
		{
			let f = txt.match ( r.r );

			if ( !f )
			{
				continue;
			}

			found.push({
				type: r.type,
				found: f,
				check: r.check,
				fnct: r.fnct,
			});
		}

		return found.sort ( (a,b)=>a.found.index-b.found.index )[ 0 ]
	}
}