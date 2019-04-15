const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getNotes', mid.requiresLogin, controllers.Note.getNotes);
  app.post('/deleteNotes', mid.requiresLogin, controllers.Note.deleteNotes);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePassHandle);
  //app.get('/deleteAccount', mid.requiresLogin, controllers.Account.deletePage);
  //app.get('/deleteAccount', mid.requiresLogin, controllers.Account.deleteAccount);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Note.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Note.make);
  app.get('/*', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
