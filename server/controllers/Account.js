const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// load the change pass page
const changePass = (req, res) => {
  res.render('changepass', { csrfToken: req.csrfToken() });
};
// load the delete account page
const deleteAccount = (req, res) => {
  res.render('deleteAccount', { csrfToken: req.csrfToken() });
};


const changePassHandle = (req, res) => {
  // console.log(req.session.account._id);
  const userID = req.session.account._id;
  // console.log(req.body.pass);

  let userPass;
  let userSalt;

  Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.session.account.username,
      salt,
      password: hash,
    };
    // console.log(accountData.salt);
    userPass = accountData.password;
    userSalt = salt;
    Account.AccountModel.findById(userID, (err, doc) => {
      if (err) {
        console.log(err);
      }
      const docu = doc;
      docu.password = userPass;
      docu.salt = userSalt;
      docu.save();
      return res.json({ redirect: '/maker' });
    });
  });
};

const deleteAccountHandle = (req, res) => {
  // console.log(req.session.account._id);
  const userID = req.session.account._id;

  Account.AccountModel.deleteOne({ _id: userID }, (err) => {
    res.json({ redirect: '/logout' });
    if (err) { console.log(err); }
  });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // console.log(req.body.username, req.body.pass, req.body.pass2);

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'username already in use.' });
      }
      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;
  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.changePass = changePass;
module.exports.changePassHandle = changePassHandle;
module.exports.deleteAccount = deleteAccount;
module.exports.deleteAccountHandle = deleteAccountHandle;
module.exports.signup = signup;
module.exports.getToken = getToken;
