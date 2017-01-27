var restify = require('restify');
var q = require('q');
var path = require('path');
var chatApi = require('./socketChatApi');
var vkApi = require('../lib/vkApi');
initBasicComponents();

module.exports.init = function () {
  var server = restify.createServer();
  server
    .use(restify.fullResponse())
    .use(restify.bodyParser())
    .use(restify.queryParser());

  chatApi.init(server.server);

  server.on('MethodNotAllowed', CORSPolicy.unknownMethodHandler);

  server.post("/user", UserController.login, AuthPolicy.login);

  server.use(AuthPolicy.checkSession);
  server.get("/user/confirmPolicy", UserController.confirmPolicy);
  server.get("/user", UserController.find);
  server.post("/user/logout", UserController.logout);
  server.get("/user/settings", UserController.getSettings);
  server.put("/user/settings", UserController.updateSettings);
  server.put("/user/activity", UserController.updateActivity);
  server.get("/user/photos", UserController.findPhotos);
  server.put("/user/photos", UserController.updatePhotos);
  server.put("/user/devices", UserController.addDevice);

  server.get("/profile/:id", ProfileController.findProfile);

  server.get("/suggestions", SuggestController.findByGeo);
  server.post("/suggestions/like", SuggestController.like);
  server.post("/suggestions/dislike", SuggestController.dislike);
  server.post("/suggestions/report", SuggestController.report);
  server.post("/suggestions/block", SuggestController.block);

  server.get("/chats", ChatController.findAll);
  server.get("/chats/info", ChatController.getChatsInfo);
  server.get("/chats/matched/:matchedProfileId", ChatController.getMatchedChat);
  server.get("/chats/:chatId", ChatController.find);
  server.get("/chats/:chatId/messages", ChatController.findMessages);

  vkApi.init();

  var deferred = q.defer();
  var port = process.env.PORT || 3000
  server.listen(port, function (err) {
    if (err) {
      logger.error(err);
      deferred.reject();
    } else {
      logger.info('API is ready at : ' + port);
      deferred.resolve();
    }
  });
  return deferred.promise;
};

function initBasicComponents() {
  var fs = require('fs');
  initComponent('controllers');
  initComponent('services');
  initComponent('policies');

  function initComponent(component) {
    var root = path.dirname(require.main.filename);
    var componentPath = root + '/api/' + component;
    fs.readdirSync(componentPath).forEach(function (file) {
      if (file.indexOf('.js') != -1) {
        GLOBAL[file.split('.')[0]] = require(componentPath + '/' + file);
      }
    })
  }
}
