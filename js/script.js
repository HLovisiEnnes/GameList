window.onload = init;

// The game manager as a global variable
let gm; 

//these variables will be used to control the direction of sorting as increasing or decreasing
var directions = [0,0,0,0,0];


function init() {
    console.log("Page is ready, elements displayed, and resources that can take time ready too (videos)")
    gm = new GameManager();
    
    gm.addTestData();

    // Display games in a table
    gm.displayGamesAsATable("gameTable");


    console.log(gm.listOfGames);
}

function formSubmitted() {
	// Get the values from input fields
	let cover = document.querySelector("#cover");
	let name = document.querySelector("#name");
	let plataform = document.querySelector("#plataform");
	let time = document.querySelector("#time");
	let genre = document.querySelector("#genre");
	let metacritics = document.querySelector("#metacritics");

	//create the instance of new game
	let newGame = new Game(cover.value, name.value, plataform.value, genre.value, metacritics.value, time.value);
	
  	console.log(newGame);

	//add new game to game list
	gm.add(newGame);
		
	//empty the input fields
	cover.value = "";
	name.value = "";
	plataform.value = "";
	time.value = "";
	genre.value = "";
	metacritics.value = "";

	// refresh the html table
	gm.displayGamesAsATable("gameTable");


	// do not let your browser submit the form using HTTP
	return false;

}

class Game {
	//game class
	constructor(cover, name, plataform, genre, metacritics, time) {
		this.cover = cover;
		this.name = name;
    	this.plataform = plataform;
    	this.genre = genre;
		this.metacritics = metacritics;
		this.time = time;
	}
}

class GameManager {
	constructor() {
		// when we build the game manager, it
		// has an empty list of games
		this.listOfGames = [];
	}
	
	addTestData() {
		//just example test data
		var c1 = new Game("https://howlongtobeat.com/games/6585_Ni_no_Kuni_Wrath_of_the_White_Witch.jpg","Ni no Kuni","Playstation 4","RPG","86", "44");
		var c2 = new Game("https://image.api.playstation.com/cdn/EP0700/CUSA09243_00/gpvypkcBjDYaMXb7cwCzq8RXa5rGmBSD.png","Ni no Kuni 2: Revenant Kingdom","Playstation 4","RPG","84", "39");
		
		this.add(c1);
		this.add(c2);

	}
	
	add(game) {
		this.listOfGames.push(game);
		console.log(typeof game.time);
	}

  displayGamesAsATable(idOfContainer) {
		// creates HTML table
    	let table = document.querySelector("#" + idOfContainer);
      	table.innerHTML =  '<caption>LIST OF GAMES TO PLAY</caption>'
						+ '<tr><th scope="col">Cover</th>'
						+ '<th><button class = headerBtn onclick="sortByIndex(0)">Game name</button></td>'
						+ '<th><button class = headerBtn onclick="sortByIndex(1)">Plataform</button></td>'
						+ '<th><button class = headerBtn onclick="sortByIndex(2)">Genre</button></td>'
						+ '<th><button class = headerBtn onclick="sortByIndex(3)">Metacritic</button></td>'
						+ '<th><button class = headerBtn onclick="sortByIndex(4)">Time to beat</button></td>' 
						+ '<th scope="col">Delete</th></tr>';

		
		if(this.listOfGames.length === 0) {
			table.innerHTML = "<p>No games to display!</p>";
			//stop the execution of this method
			return;
		}  
  
          
    	// iterate on the array of users
    	this.listOfGames.forEach(function(currentGame) {
        	// creates a row
        	var row = table.insertRow();
      if (currentGame.cover === '') {
        row.innerHTML = "<td></td>";
        } else {
          row.innerHTML = '<td><img src="' + currentGame.cover + '"height="200" width="140"></td>';
        } 
			
        row.innerHTML += "<td>" + currentGame.name + "</td>"
							+ "<td>" + currentGame.plataform + "</td>"
              + "<td>" + currentGame.genre + "</td>"
							+ "<td>" + currentGame.metacritics + "</td>"
							+ "<td>" + currentGame.time + "</td>"  
              + '<td><button class="delete_btn" onclick="deleteRow(this)"><i class="fa fa-trash"></i></button></td>';
     	});
  	}
	
}

function deleteRow(btn) {
	//choose the row to be deleted
	var row = btn.parentNode.parentNode;
	//name of the game to be deleted
	var gameName = row.children[1].innerHTML;	
	

	for(let i = 0; i < gm.listOfGames.length; i++) { 
		var c = gm.listOfGames[i];

		if(c.name === gameName) {
			// remove the game at index i
			
			
			console.log(c.name);
			gm.listOfGames.splice(i, 1);
			// stop/exit the loop
			break;
		}
	}
	console.log(gm.listOfGames);
	//delete the removed game's row
	row.parentNode.removeChild(row);
 }

//search part
function searchFunction() {
    //Inspired by  https://www.w3schools.com/howto/howto_js_filter_table.asp*/
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchForm");
    filter = input.value.toUpperCase();
    table = document.getElementById("gameTable");
    tr = table.getElementsByTagName("tr");
  
    // loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
    //make so that we search by name 
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        //gets case insensitive
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }


function load() {
	//loads browser inner state
	if(localStorage.games !== undefined) {
		gm.listOfGames = JSON.parse(localStorage.games);
	}
	gm.displayGamesAsATable("gameTable");
	console.log(gm.listOfGames);
}

function save() {
	//saves browser inner state
	localStorage.games = JSON.stringify(gm.listOfGames);
} 

function download() {
	//idea from stack https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser

	//get today's date
	const date = new Date();

	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	let currentDate = `${day}/${month}/${year}`;


	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gm.listOfGames));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", currentDate + '_games_to_play' + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}


function upload() {
	//got the basic idea from  grapper https://www.grepper.com/profile/xyndra
    const input = document.createElement('input');
    input.style.visibility = 'hidden';
    input.type = 'file';
    input.onchange = e => { 
        // getting a hold of the file reference
        const file = e.target.files[0];
        // setting up the reader
        const reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            let content = readerEvent.target.result; // this is the content!
            try {
                // Try to read json
                // noinspection JSCheckFunctionSignatures
                objs = JSON.parse(content);
				gm.listOfGames = objs;
				gm.displayGamesAsATable("gameTable");
            } catch (e) {
                objs = {};
            }
        }
    }
    input.click();
}

function sortByIndex(index){
	//sort according to chosen index
	switch (index){
		case 0:
			//changes the direction of clicked element and zero the rest
			directions[0] = (directions[0] + 1)%2;
			directions[1] = 0;
			directions[2] = 0;
			directions[3] = 0;
			directions[4] = 0;

			gm.listOfGames = gm.listOfGames.sort(compareByName);

			//make direction
			if (directions[0] === 1){
				gm.listOfGames = gm.listOfGames.reverse();
			}
			break;

		case 1:
			//changes the direction of clicked element and zero the rest
			directions[1] = (directions[1] + 1)%2;
			directions[0] = 0;
			directions[2] = 0;
			directions[3] = 0;
			directions[4] = 0;

			gm.listOfGames = gm.listOfGames.sort(compareByPlataform);

			//make direction
			if (directions[1] === 1){
				gm.listOfGames = gm.listOfGames.reverse();
			}
			break;

		case 2:
			//changes the direction of clicked element and zero the rest
			directions[2] = (directions[2] + 1)%2;
			directions[0] = 0;
			directions[1] = 0;
			directions[3] = 0;
			directions[4] = 0;

			gm.listOfGames = gm.listOfGames.sort(compareByGenre);

			//make direction
			if (directions[2] === 1){
				gm.listOfGames = gm.listOfGames.reverse();
			}
			break;

		case 3:
			//changes the direction of clicked element and zero the rest
			directions[3] = (directions[3] + 1)%2;
			directions[0] = 0;
			directions[1] = 0;
			directions[2] = 0;
			directions[4] = 0;

			gm.listOfGames = gm.listOfGames.sort(compareByMetacritics);

			//make direction
			if (directions[3] === 1){
				gm.listOfGames = gm.listOfGames.reverse();
			}
			break;

			case 4:
				//changes the direction of clicked element and zero the rest
				directions[4] = (directions[4] + 1)%2;
				directions[0] = 0;
				directions[1] = 0;
				directions[3] = 0;
				directions[2] = 0;


				gm.listOfGames = gm.listOfGames.sort(compareByTime);
	
				//make direction
				if (directions[4] === 1){
					gm.listOfGames = gm.listOfGames.reverse();
				}
				break;
					
		}
	// refresh the html table
	gm.displayGamesAsATable("gameTable");

}

function compareByName(c1,c2){
	if (c1.name < c2.name)
		 return -1;
	
	if (c1.name > c2.name)
		 return 1;

	return 0;
}

function compareByPlataform(c1,c2){
	if (c1.plataform < c2.plataform)
		 return -1;
	
	if (c1.plataform > c2.plataform)
		 return 1;

	return 0;
}

function compareByGenre(c1,c2){
	if (c1.genre < c2.genre)
		 return -1;
	
	if (c1.genre > c2.genre)
		 return 1;

	return 0;
}

function compareByMetacritics(c1,c2){
	if (parseInt(c1.metacritics) < parseInt(c2.metacritics))
		 return -1;
	
	if (parseInt(c1.metacritics) > parseInt(c2.metacritics))
		 return 1;

	return 0;
}

function compareByTime(c1,c2){
	if (parseInt(c1.time) < parseInt(c2.time))
		 return -1;
	
	if (parseInt(c1.time) > parseInt(c2.time))
		 return 1;

	return 0;
}