module.exports = function(app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  // app.get('/', function(req, res) {
  //   res.render('index.ejs');
  // });

  //display vending machine and inventory collection
  app.get('/', function(req, res) {
    db.collection('inventory').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('vending.ejs', {
        inventory: result
      })
    })
  });

  //if user is logged in redirect to owner's page. display both transaction and inventory collections
  app.get('/owner', isLoggedIn, function(req, res) {
    db.collection('transactions').find().toArray((err, bank) =>{
      db.collection('inventory').find().toArray((err, info) => {
        if (err) return console.log(err)
        res.render('owner.ejs', {
          user : req.user,
          inventory: info,
          transactions: bank
        })
      })
    })
  });

  //owner's form to post to database
  app.post('/owner', (req, res) =>{
    //compare with all collection items
    //
    db.collection('inventory').insertOne({name: req.body.itemName, url: req.body.itemUrl, price: parseFloat(req.body.itemPrice), code: req.body.itemCode, stock: parseInt(req.body.stock)}, (err, result) =>{
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/owner')
    })
  })

  //display user item picked
  app.put('/vending', (req, res) => {
    db.collection('inventory').findOneAndUpdate({code: req.body.code}, {
      //Make sure to give the bank document a name field
      $inc: {
        //have to make sure to add the price of the selected item to the put fetch for updating bank
        stock: -1
      }
    }, {
      sort: {_id: -1},
      upsert: false
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

  //bank info
  //extra features: hide form when one document exists within transactions. add reset button to the displayed total amount to remove that document and have the form pop back up again.
  app.post('/ownerBank', (req, res) =>{
    db.collection('transactions').insertOne({totalAmount: parseFloat(req.body.bankAmount)}, (err, result) =>{
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/owner')
    })
  })

  app.put('/vendingBank', (req, res) => {
    db.collection('transactions').findOneAndUpdate({}, {
      //increase the property by the value inserted
      $inc: {
        //have to make sure to add the price of the selected item to the put fetch for updating bank
        totalAmount : req.body.price
      }
    }, {
      sort: {_id: -1},
      upsert: false
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
  })

  //owner routes for delete and restock
  app.put('/owner', (req, res) => {
    console.log(req.body)
    db.collection('inventory').findOneAndUpdate({name: req.body.name, url: req.body.url}, {
   $set: {
     stock: req.body.stock
   }
 }, {
   sort: {_id: -1},
   upsert: true
 }, (err, result) => {
   if (err) return res.send(err)
   res.send(result)
 })
})


  app.delete('/owner', (req, res) => {
    db.collection('inventory').findOneAndDelete({name: req.body.name, url: req.body.url}, (err, result) => {
      if(err) return res.send(500, err)
      res.send('message deleted!')
    })
  })
  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/owner', // redirect to main page
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/owner', // redirect to main page
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/owner');
    });
  });

  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
    return next();

    res.redirect('/');
  }
}
