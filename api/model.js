var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {

  init: function () {

    var s = config.dbSettings;
    var connection = mongoose.connect('mongodb://deen:dr150314@ds135669.mlab.com:35669/heroku_v3hvcglq', function (err) {
      if (err) {
        logger.error('Mongodb connection error: ' + err);
      }
    });

    //User
    var userSchema = require('./models/User');
    userSchema.index({"lastKnownPosition": "2dsphere"});
    GLOBAL['User'] = mongoose.model('User', userSchema);

    //Match
    var matchSchema = require('./models/Match');
    GLOBAL['Match'] = mongoose.model('Match', matchSchema);

    //Messae
    var messageSchema = require('./models/Message');
    GLOBAL['Message'] = mongoose.model('Message', messageSchema);

    var chatSchema = require('./models/Chat');
    GLOBAL['Chat'] = mongoose.model('Chat', chatSchema);

    var reportSchema = require('./models/Report');
    GLOBAL['Report'] = mongoose.model('Report', reportSchema);
  }
}

