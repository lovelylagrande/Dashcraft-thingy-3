function getplayers() {
  
  //import the require library to make http requests to a server
  const request = require('request');
  
  //values to be sent via a restful GET request 
  const list = [
    'value_one',
    'value_two'
  ];
  
  //store resoonses from GET request
  var listOfResponses = [];
  
  //loop through the list
  var loop = function(array, index, cb) {  
    if (index === array.length)
        cb();
        return;
  
    //Make a rest GET call to a server
    var url = 'http://notsurehowtomakethisworksoiamaskingstackoverflow.com/api/words/' + array[i];
    request(url, {
      json: true
    }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }
  
      //store the response from the server into out array
      listOfResponses.push(body.response);
      loop(array, i++, cb);
    });
  };
  
  loop(list, 0, function() {
        /* ******************************* 
           HERE I WANT TO DO STUFF WITH listOfResponses ONCE ALL THE REQUESTS FINISH
         ********************************** */
  });
}

function pfind(playername) {
  if (playerlist == null) {
    
  }
}