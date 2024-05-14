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
  getTrackGhosts(ID);
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
    listItem.href = "https://dashcraft.io?t=" + recordList[i][0];
    listItem.innerHTML = recordList[i][1];
    dropContent.appendChild(listItem);
  }

  dropdown.appendChild(dropContent);

  document.getElementById("recordList").appendChild(dropdown);
  document.getElementById("recordList").appendChild(document.createElement("br"));

}


async function sendOut(response) {
  console.log(response);
  trackname = response.name;
  laps = response.lapsCount + 1;
  likes = response.likesCount;
  dislikes = response.dislikesCount;
  verified = response.verified;
  lb = response.leaderboard;
  creator = response.user.username;
  public = response.isPublic;
  var padding = 30;
  var padding2 = 22
  document.getElementById("p1").innerHTML = ("<u>Created By:</u> " + creator.toString()).padEnd(padding) + ("<br><u>Laps:</u> ".padEnd(padding2) + laps.toString()).padEnd(padding) + ("<br><u>Likes:</u> ".padEnd(padding2) + likes.toString()).padEnd(padding) + ("<br><u>Dislikes:</u> ".padEnd(padding2) + dislikes.toString()).padEnd(padding) + ("<br><u>Verified:</u> ".padEnd(padding2) + verified.toString()).padEnd(padding) + ("<br><u>Public:</u> ".padEnd(padding2) + public.toString()).padEnd(padding);

  lbstr = "<u>    username     |   time   | distance | speed </u><br>";
  ghostList = await getTrackGhosts(response._id)
  
  for (let i = 0; i < lb.length; i++) {
    let ghostListUser = ghostList[lb[i].user._id]
    let ghostLen = ghostListUser.ghostLen;
    let averageSpeed = ghostListUser.averageSpeed;
    lbstr += (lb[i].user.username).padEnd(16) + " | " + lb[i].time.toString().padEnd(8) + " | ";
    lbstr += Math.round(ghostLen).toString().padEnd(8) + " | " + Math.round(averageSpeed).toString().padEnd(6);
    lbstr += "<br>"
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

  for (let i = 0; i < piecekeys.length; i++) {
    text += "<u>" + (getPieceText(piecekeys[i]) + ":</u>").padEnd(30) + piecedict[piecekeys[i]].toString().padEnd(5)
    text += "<br>"
  }
  //text += "Specific piece counter will be added once the full game is released";

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
  var URL1 = "https://api.dashcraft.io/trackv2/global3?sort=new&verifiedOnly=true&page=";
  if (countAll) {
    URL1 = "https://api.dashcraft.io/trackv2/global3?sort=new&verifiedOnly=false&page=";
  }
  for (let i = 0; i < 200; i++) {
    fetches.push(
      fetch(URL1 + i + "&pageSize=50")
                 .then((response) => response.json())
                 .then((json) => {
      //console.log(json);
      let json1 = json.tracks;
      let IDarr = [];
      for (let a = 0; a < json1.length; a++) {
        IDarr.push(json1[a]._id);
      }
      //console.log("IDarr:" + IDarr.toString());
      return IDarr;
    }));
  }

  Promise.all(fetches)
    .then((IDL) => {
      IDarr = [];
      console.log("Search found " + IDL.length + " tracks.");
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
  var checkCheats = true;
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
          var creatorName = json.user.username;
          if (trackName == "") {
           trackName = "Unnamed Track"
          }
          var track = [json._id, creatorName];

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
      document.getElementById("recordList").innerHTML = "";
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
    background: "transparent",
    legendSettings:{
      height: '400', width:'200', textStyle: {color: 'white'}
    },
    palette: ["#EDC2FF", "#BDC2AF", "#DD72EF", "#EDC2CF", "#ADC2FF"]
    });

  document.getElementById("container").innerHTML = "";
  pie.appendTo('#container');
}