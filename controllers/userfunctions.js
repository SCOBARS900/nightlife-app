var User = require('../models/user');
var Bar = require('../models/bar');

module.exports = {
    
    userHasCity: function(req, res, next) {
        var foundLastCity = false;
        
        if (req.user != undefined) {
            userId = req.user._id;
            
            User.findOne({ '_id': userId }, function(err, data) {
                if (err) {
                    throw err;
                } 
          
         if (data) {
             if (data.google.lastCitySearch != undefined && data.google.lastCitySearch != "No Searchs Results") {
                  foundLastCity = true;
                  cityEntry = data.google.lastCitySearch;
                  res.redirect('/search/' + data.google.lastCitySearch);
             } 
             
             
             if (data.twitter.lastCitySearch != undefined && data.twitter.lastCitySearch != "No Searchs Results") {
                 foundLastCity = true;
                 cityEntry = data.twitter.lastCitySearch;
                 res.redirect('/search/' + data.twitter.lastCitySearch);
             } 
             
             if (data.local.lastCitySearch != undefined && data.local.lastCitySearch != "No Searchs Results") {
                 foundLastCity = true;
                 cityEntry = data.local.lastCitySearch;
                 res.redirect('/search/' + data.local.lastCitySearch);
             }
             
             if(!foundLastCity) {
                 next();
             }
             
        
         }
         });
          
        } else {
            next();
        }
    
    
    },
    
    
    userLastCity: function(req, res) {
        
        var city = req.body.city.toLowerCase();
        city = city.replace(/ã|â|á/gi, 'a');
        city = city.replace(/í/gi, 'i');
        city = city.replace(/ç/gi, 'c');
        city = city.replace(/ó|ô/gi, 'o');
        city = city.replace(/é|ê/gi, 'e');
        cityEntry = city;
        
        if (req.user != undefined) {
            userId = req.user._id;
 
            User.findOne({ '_id': userId }, function(err, data) {
         if (err) {
             throw err;
         } 
          
         if (data) {
             if (data.google.lastCitySearch != undefined) {
                 data.google.lastCitySearch = cityEntry;
                 data.save(function(err) {
                       if(err) {
                           throw err;
                       } 
                  });
             }
             if (data.twitter.lastCitySearch != undefined) {
                 data.twitter.lastCitySearch = cityEntry;
                 data.save(function(err) {
                       if(err) {
                           throw err;
                       } 
                  });
             }
             if (data.local.lastCitySearch != undefined) {
                 data.local.lastCitySearch = cityEntry;
                 data.save(function(err) {
                       if(err) {
                           throw err;
                       } 
                  });
             }
             
             
             res.redirect('/search/' + cityEntry); 
             
         } else {
             res.redirect('/search/' + cityEntry);
         } 
          
      });      
        
        } else {
             res.redirect('/search/' + cityEntry); 
        }

        
    },
    
    
 
};