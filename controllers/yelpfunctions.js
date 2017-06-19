var yelp = require('yelp-fusion');
var User = require('../models/user');
var Bar = require('../models/bar');

module.exports = {
  yelpAuthenticate: function(req, res) {
   var clientId = process.env.YELP_KEY;
   var clientSecret = process.env.YELP_SECRET;
   citySearch = req.params.cityparam;
   userId = "Not Logged";
   
 
   if (req.user != undefined) {
      userId = req.user._id;
   }
   
      
    var searchRequest = {    
      location: citySearch,
      radius: 20000,
      term: 'bars',
      limit: 30
    };
      
    var barResults = [];
    var notFound = "";
    var encodedNames = [];
    var goingTonight = 0;
    var totalVisitors = 0;
    var lightGoing = false;
    
      
 
yelp.accessToken(clientId, clientSecret).then(response => {
  var client = yelp.client(response.jsonBody.access_token);

  client.search(searchRequest).then(response => {
    var responseLength = response.jsonBody.businesses.length;
      
    if (responseLength > 0) {
      for (i = 0; i < responseLength; i++) {
         barResults.push(response.jsonBody.businesses[i]);
         encodedNames.push(encodeURI(response.jsonBody.businesses[i].name))   
      }
        
        
    Bar.find({ 'bars.barCity': cityEntry }, function(err, data) {
       if (err) {
           throw err;
           
       } 
        
       if (data) { 
          res.render('allbars.ejs', { barlist: barResults, notfound: "Found", encodedlist: encodedNames, bardata: data, goingtonight: goingTonight, totalvisitors: totalVisitors, lightgoing: lightGoing, userid: userId }); 
           
       }  else {
           res.render('allbars.ejs', { barlist: barResults, notfound: "Found", encodedlist: encodedNames, goingtonight: goingTonight, totalvisitors: totalVisitors, lightgoing: lightGoing, userid: userId }); 
       }
        
        
        
        
    });
     
     
          
    } else {
         res.render('allbars.ejs', { barlist: barResults, notfound: "No results found.", encodedlist: encodedNames, goingtonight: goingTonight, totalvisitors: totalVisitors, lightgoing: lightGoing, userid: userId }); 
    } 
     
    
      
    }).catch(e => {
    res.render('allbars.ejs', { barlist: barResults, notfound: "No results found.", encodedlist: encodedNames, goingtonight: goingTonight, totalvisitors: totalVisitors, lightgoing: lightGoing, userid: userId });
    });
    }).catch(e => {
    res.render('allbars.ejs', { barlist: barResults, notfound: "No results found.", encodedlist: encodedNames, goingtonight: goingTonight, totalvisitors: totalVisitors, lightgoing: lightGoing, userid: userId });
    });
 },  
    
   yelpSpecific: function(req, res) {
   var clientId = process.env.YELP_KEY;
   var clientSecret = process.env.YELP_SECRET;
   var barEncoded = req.params.barparam;
   var barDecoded = decodeURI(barEncoded);
    

    var searchRequest = { 
      location: citySearch,
      term: barDecoded,
      limit: 1,
    };
      
    var barArray = [];
    var notFound = "";
      
  yelp.accessToken(clientId, clientSecret).then(response => {
  var client = yelp.client(response.jsonBody.access_token);

  client.search(searchRequest).then(response => {
    
      
    if(response.jsonBody.businesses.length > 0) {
         barArray.push(response.jsonBody.businesses[0]);
    }    
     else {
         notFound = "No results found."
    } 
                                    
     
    res.render('specificbar.ejs', { specificbar: barArray[0], notfound: notFound });  
      
  });
}).catch(e => {
  console.log(e);
});
          
  },
    
  yelpCleanToday: function(req, res, next) {
        
        Bar.find({  }, function(err, data) {
       if(err) {
           throw err;
       } 
            
        
       if(data) {
           
           
           var eraseTodayUsers = data.map(function(bar) {
              var barIdMap = bar.bars.id;
               
              Bar.findOne({ 'bars.id': barIdMap }, function(err, data) {
              if (err) {
                  throw err;
              } 
            
              if (data) {
                  var todayDate = new Date();
                  var todayDay = todayDate.getDate();
                  var todayMonth = todayDate.getMonth();
                  var todayYear = todayDate.getFullYear();
                  
                  
                  var allUsersTodayArray = data.bars.voteUsersToday.map(function(usersToday) {
                   var lastVoteDate = usersToday.voteUserTodayDate;
                   var lastVoteDateDay = lastVoteDate.getDate();
                   var lastVoteDateMonth = lastVoteDate.getMonth();
                   var lastVoteDateYear = lastVoteDate.getFullYear();
                    
                   if(todayDay != lastVoteDateDay || todayMonth != lastVoteDateMonth || todayYear != lastVoteDateYear) {
                      usersToday.remove();  
                   }  
                      
                  });
                  
                  data.save(function(err) {
                       if(err) {
                           throw err;
                       } 
                  });
                  
                  
              }
                        
                  
                  
                  
              });
               
  
               
           });
           
           
           next();
           
       } else {
           next();
       }
        
            
             
       });
        
        
    },
    


    
  yelpRegistry: function(req, res, next) {
    var userBarId = req.user._id;
    var barClickedId = req.body.outputbarid;
    var userInDatabase = false;
    var alreadyVoteToday = false;
    var removedToday = false;
    
    
      
    var newVoteUserArray = [{
        voteUserId: userBarId,
        voteUserLastDate: new Date()    
    }];
    
    var newVoteUserToday = [{
        voteUserTodayId: userBarId,
        voteUserTodayDate: new Date()
    }];
    

    
    Bar.findOne({ 'bars.id': barClickedId }, function(err, data) {
       if(err) {
           throw err;
       } 
            
        
       if(data) {
           
           for (i = 0; i < data.bars.voteUsers.length; i++) {
               
               
               if(data.bars.voteUsers[i].voteUserId == userBarId) {
                   userInDatabase = true;
                           
                   var lastVoteDate = data.bars.voteUsers[i].voteUserLastDate;
                   var lastVoteDateDay = lastVoteDate.getDate();
                   var lastVoteDateMonth = lastVoteDate.getMonth();
                   var lastVoteDateYear = lastVoteDate.getFullYear();
                   
                   var todayDate = new Date();
                   var todayDay = todayDate.getDate();
                   var todayMonth = todayDate.getMonth();
                   var todayYear = todayDate.getFullYear();
                   
                   
                   if (lastVoteDateDay == todayDay && lastVoteDateMonth == todayMonth && lastVoteDateYear == todayYear ) {
                          alreadyVoteToday = true;
                          
                          next();  

                   }   else {
                       data.bars.usersAllTime += 1;
                       data.bars.voteUsersToday.push(newVoteUserToday[0]);
                       data.bars.voteUsers[i].voteUserLastDate = new Date();
                       
                       
                       data.save(function(err) {
                       if(err) {
                           throw err;
                       } else {
                           res.redirect('/search/' + cityEntry);
                       }
                       });
                       
                       
                   }
                            
           
               }
           }
           
           
           
           
           if (!userInDatabase) {
               data.bars.usersAllTime += 1;
               data.bars.voteUsers.push(newVoteUserArray[0]);
               data.bars.voteUsersToday.push(newVoteUserToday[0]);
               
                
               data.save(function(err) {
                   if(err) {
                       throw err;
                   } else {
                       res.redirect('/search/' + cityEntry);
                   }
                });
               
           }
           
           
       } else {
           var newBar = new Bar();
           newBar.bars.id = barClickedId;
           newBar.bars.voteUsers.push(newVoteUserArray[0]);
           newBar.bars.voteUsersToday.push(newVoteUserToday[0]);
           newBar.bars.creationDate = new Date();
           newBar.bars.usersAllTime += 1;
           newBar.bars.barCity = cityEntry;
           
           newBar.save(function(err) {
                if(err) {
                    throw err;
                } else {
                    res.redirect('/search/' + cityEntry);
                }
            });
           
           
           
        }
        
    
        
      
    });
    
    
    
    
     
},
    
    
    yelpDelete: function(req, res) {
        var userBarId = req.user._id;
        var barClickedId = req.body.outputbarid;
        var voteTodayIdArray = [];
        var userFound = false;
        
        
    
      
        var newVoteUserArray = [{
            voteUserId: userBarId,
            voteUserLastDate: new Date()    
        }];

        var newVoteUserToday = [{
            voteUserTodayId: userBarId,
            voteUserTodayDate: new Date()
        }];
        
        
        Bar.findOne({ 'bars.id': barClickedId }, function(err, data) {
       if(err) {
           throw err;
       } 
            
        
       if(data) {
           if(data.bars.voteUsersToday.length > 0) {
               
               for (y = 0; y < data.bars.voteUsersToday.length; y++ ) {
          voteTodayIdArray.push(data.bars.voteUsersToday[y].voteUserTodayId);
               }
               
               for (z = 0; z < voteTodayIdArray.length; z++) {
                   if(voteTodayIdArray[z].indexOf(userBarId) != -1) {
                      userFound = true; 
                   }  
               }
               
            
               
               
               if (!userFound) {
                   data.bars.usersAllTime += 1;
                   data.bars.voteUsersToday.push(newVoteUserToday[0]);
                   for (a = 0; a < data.bars.voteUsers.length; a++) {
                   if(data.bars.voteUsers[a].voteUserId == userBarId) {
                       data.bars.voteUsers[a].voteUserLastDate = new Date();
                   }
                   }
                   data.save(function(err) {
                           if(err) {
                               throw err;
                           } 
                });
                
                
                res.redirect('/search/' + cityEntry);
                   
               } else {
                   for (w = 0; w < data.bars.voteUsersToday.length; w++ ) {
                   if(data.bars.voteUsersToday[w].voteUserTodayId == userBarId) {
                       data.bars.usersAllTime -= 1;
                       data.bars.voteUsersToday[w].remove();
                       data.save(function(err) {
                           if(err) {
                               throw err;
                           } 
                           });
                       
                       res.redirect('/search/' + cityEntry); 
                   }  
               }
                   
               }
               
               
                 
           }  else {
               
               data.bars.usersAllTime += 1;
               data.bars.voteUsersToday.push(newVoteUserToday[0]);
               for (a = 0; a < data.bars.voteUsers.length; a++) {
                   if(data.bars.voteUsers[a].voteUserId == userBarId) {
                       data.bars.voteUsers[a].voteUserLastDate = new Date();
                   }
               }
               data.save(function(err) {
                           if(err) {
                               throw err;
                           } 
                });
                res.redirect('/search/' + cityEntry);
               
               
               
               
           }
           
   
       } else {
           res.redirect('/search/' + cityEntry);
       }
        
            
            
            
       });
        
        
    },
    
    
  
  
     
};
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    