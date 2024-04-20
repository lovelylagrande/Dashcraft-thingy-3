const banlist = ["SkyRacer99", "-DTG-Dusty.", "1stPeenuut", "game_oversight", "-MrY-", "decky12582"];

function main() {
  ID = document.getElementById("IDinput").value;
  ID = ID.replaceAll("/", "");
  ID = ID.slice(ID.length - 24);
  fetch("https://api.dashcraft.io/trackv2/" + ID + "?supportsLaps1=true", {
        headers: {
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM0NmMzNGExYmEyMjQyNGYyZTAwMzIiLCJpbnRlbnQiOiJvQXV0aCIsImlhdCI6MTcwNzM3MTU3Mn0.0JVw6gJhs4R7bQGjr8cKGLE7CLAGvyuMiee7yvpsrWg'
        }})
    .then((response) => response.json())
    .then((json) => sendOut(json));

  fetch("https://cdn.dashcraft.io/v2/prod/track/" + ID + ".json")
    .then((response) => response.json())
    .then((json) => sendPieces(json));
}

function createDropdown(playerName, recordList) {
  dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  
  button = document.createElement("button");
  button.className = "dropbtn";
  button.innerHTML = playerName;
  dropdown.appendChild(button);

  dropContent = document.createElement("div");
  dropContent.className = "dropdown-content";

  for (let i=0; i<recordList.length; i++) {
    listItem = document.createElement("a");
    listItem.target = "_blank";
    listItem.href = "https://dashcraft.io/new/?t=" + recordList[i][0];
    listItem.innerHTML = recordList[i][1];
    dropContent.appendChild(listItem);
  }
  
  dropdown.appendChild(dropContent);
  
  document.getElementById("recordList").appendChild(dropdown);
  document.getElementById("recordList").appendChild(document.createElement("br"));

}


function sendOut(response) {
  console.log(response);
  trackname = response.name;
  laps = response.lapsCount + 1;
  likes = response.likesCount;
  dislikes = response.dislikesCount;
  verified = response.verified;
  lb = response.leaderboard;
  creator = response.user.username;
  public = response.isPublic;
  
  document.getElementById("p1").innerHTML = "<u>Name:</u> " + trackname + "<br><u>Created By:</u> " + creator + "<br><u>Laps:</u> " + laps + "<br><u>Likes:</u> " + likes + "<br><u>Dislikes:</u> " + dislikes + "<br><u>Verified:</u> " + verified.toString() + "<br><u>Public:</u> " + public.toString();

  lbstr = "<u>username -- time (seconds)</u><br>";
  for (let i = 0; i < lb.length; i++) {
    lbstr += lb[i].user.username + " -- " + lb[i].time + "<br>";
  }
  document.getElementById("p3").innerHTML = lbstr;
}

function sendPieces(response) {
  pieces = response.trackPieces;
  piecelist = [];
  
  for (let i = 0; i < pieces.length; i++) {
    piecelist.push(pieces[i].id);
  }
  piecedict = condenseBasic(piecelist);
  piecekeys = valueSort(piecedict);
  
  text = "<b><u>Total pieces:</u> " + piecelist.length.toString() + "</b><br>";

  /*
  for (let i = 0; i < piecekeys.length; i++) {
    text += "<u>" + getPieceText(piecekeys[i]) + ":</u> " + piecedict[piecekeys[i]].toString()
    text += "<br>"
  }
  */
  text += "Specific piece counter will be added once the full game is released";
  
  document.getElementById("p2").innerHTML = text;
}

function condense(arr) {
  const counts = {};
  console.log(arr);
  for (const num of arr) {
    if (num === undefined) {
      continue;
    }
    if (counts[num[0]]) {
      counts[num[0]].push(num[1]);
      continue;
    }
    counts[num[0]] = [num[1],];
  }
  console.log(counts);
  return counts;
}


function condenseBasic(arr) {
  const counts = {};
  
  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }
  
  return counts;
}


function getPieceText(ID) {
  allpieces = {1:"start",2:"finish",3:"short straight",4:"medium straight",5:"long straight",6:"small turn",7:"medium turn",8:"big turn",9:"large turn",10:"short climb",11:"medium climb",12:"ramp small",13:"ramp medium",14:"ramp large",15:"curb 1",16:"curb 2",17:"curb 3",18:"vertical",19:"horizontal",20:"slope",21:"ramp 1",22:"ramp 2",23:"loop",24:"xs climb",25:"vertical 90",26:"loop with borders",27:"straight border left",28:"oblique",29:"curved inside",30:"curved outside",31:"no border",32:"pipe vertical",33:"pipe horizontal",34:"pipe curb 1",35:"pipe curb 2",38:"arrows right",39:"arrows left",40:"booth side",41:"booth corner",42:"booth middle",43:"ramp 1 border left",44:"ramp 2 border left",45:"slope border left",46:"ramp 1 no border",47:"ramp 2 no border",48:"slope no border",49:"tiny straight",50:"slope border right",51:"ramp 1 border right",52:"ramp 2 border right",53:"slope 90",54:"straight border right",55:"water side",57:"water corner",58:"water middle",59:"trees",60:"small right snake",61:"small left snake",62:"medium right snake",63:"medium left snake",64:"big right snake",65:"big left snake",66:"hill middle",67:"hill side",68:"hill corner",69:"tiny incline",70:"short incline",71:"transition right",72:"transition left",73:"bank right",74:"bank left",75:"right climb",76:"left climb"};
  return allpieces[ID];
}

function valueSort(dict) {
  var items = Object.keys(dict).map(
  (key) => { return [key, dict[key].length] });

  items.sort(
    (first, second) => { return second[1] - first[1] }
  );
  
  var keys = items.map(
    (e) => { return e[0] });

  return keys;
}

function wrCount(countAll) {
  document.getElementById("loading").innerHTML = "loading... please wait about 10 seconds";
  document.getElementById("recordList").innerHTML = "";

  if (countAll) {
    document.getElementById("loading").innerHTML = "loading... you may have to wait a while for this one";
  }
  
  var fetches = [];
  var URL1 = "https://api.dashcraft.io/trackv2/verified2?page=";
  if (countAll) {
    URL1 = "https://api.dashcraft.io/trackv2/global/";
  }
  for (let i = 0; i < 10; i++) {
    fetches.push(
      fetch(URL1 + i + "&pageSize=50")
                 .then((response) => response.json())
                 .then((json) => {
      console.log(json);
      let json1 = json.tracks;
      let IDarr = [];
      for (let a = 0; a < json1.length; a++) {
        IDarr.push(json1[a]._id);
      }
      console.log("IDarr:" + IDarr.toString());
      return IDarr;
    }));
  }

  Promise.all(fetches)
    .then((IDL) => {
      IDarr = [];
      for (let a = 0; a < IDL.length; a++) {
        for (let b = 0; b < IDL[a].length; b++) {
          IDarr.push(IDL[a][b]);
        }
      }
      IDtoPlayers(IDarr);
    });
}

function IDtoPlayers(IDs) {
  var fetches = [];
  var checkCheats = document.getElementById("cheatFilter").checked;
  for (let ID = 0; ID < IDs.length; ID++) {
    try {
      fetcH = fetch("https://api.dashcraft.io/trackv2/" + IDs[ID] + "?", {
                   headers: {
                     'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM0NmMzNGExYmEyMjQyNGYyZTAwMzIiLCJpbnRlbnQiOiJvQXV0aCIsImlhdCI6MTcwNzM3MTU3Mn0.0JVw6gJhs4R7bQGjr8cKGLE7CLAGvyuMiee7yvpsrWg'
                   }})
       .then((response) => response.json())
       .then((json) => {
          jsonLB = json.leaderboard;
          var trackName = json.name;
          if (trackName == "") {
           trackName = "Unnamed Track"
          }
          var track = [json._id, trackName];
         
          for (let v=0; v<jsonLB.length; v++) {
            var username = jsonLB[v].user.username;
            
            var time = jsonLB[v].time;
            if (!checkCheats) {
              return [username, track];
            } else if (!(banlist.includes(username)/* || (Math.round(time) == time)*/)) {
              return [username, track];
            }
            else {
              console.log(username + " -- " + IDs[ID])
            }
          }
          if (jsonLB.length == 0) {
            return ["Empty Leaderboard", track]
          }
         
        })
      fetches.push(fetcH);
    } catch (error) {
      console.log(error);
    }
  }
  Promise.all(fetches)
    .then((users) => {
      recorddict = condense(users);
      indexlist = valueSort(recorddict);

      for (let i=0; i<indexlist.length; i++) {
        createDropdown(indexlist[i] + ": " + recorddict[indexlist[i]].length.toString(), recorddict[indexlist[i]]);
      }
      
      document.getElementById("loading").innerHTML = "";
      console.log(indexlist);
      console.log(recorddict);

      dataList = [];

      for (let i=0; i<indexlist.length; i++) {
        dataDict = {'x':indexlist[i], 'y':recorddict[indexlist[i]].length};
        dataList.push(dataDict);
      }
      
      displayPie(dataList);
      
    });
}


function displayPie(theData) {
  console.log(theData);
  var pie = new ej.charts.AccumulationChart({
    //Initializing Series
    series: [
        {
            dataSource: theData,
            dataLabel: {
                visible: true,
                position: 'Inside',
                font: { fontWeight: '600', color: 'white' }
            },
            xName: 'x',
            yName: 'y'
        }
    ],
    
    tooltip: { enable: true, header: 'all tracks', format: '${point.x}:<b> ${point.y} records<b>' },
      
    legendSettings: {
      visible: false,
    }, 
    background: 'DDCCEE',
    legendSettings:{
      height: '400', width:'200', textStyle: {color: 'white'}
    }
    
    });

  document.getElementById("container").innerHTML = "";
  pie.appendTo('#container');
}