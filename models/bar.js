var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var barSchema = new Schema({
bars: {
    id: String,
    barCity: String,
    voteUsers: [{
        voteUserId: String,
        voteUserLastDate: Date,
    }],
    voteUsersToday: [{
       voteUserTodayId: String,
       voteUserTodayDate: Date,
    }],
    creationDate: Date,
    usersAllTime: { type: Number, default: 0 }
  }
    
});

module.exports = mongoose.model('Bar', barSchema);