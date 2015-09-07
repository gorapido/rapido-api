module.exports = function(router) {
  var express = require('express'),
    xml = require('xml'),
    passport = require('passport'),
    twilio = require('twilio')('AC30305b01bf87626c22b822a0584ab5d9', '173b5a54238da3ced4a7face0b1d7098'),
    crypto = require('crypto'),
    mandrill = require('mandrill-api/mandrill'),
    fbgraph = require('fbgraph');
  var BasicStrategy = require('passport-http').BasicStrategy;
  var models = require('./models');
  var User = models.User,
    Company = models.Company,
    Review = models.Review,
    Address = models.Address,
    Coordinate = models.Coordinate,
    Job = models.Job,
    Bid = models.Bid;
  var mailer = new mandrill.Mandrill('QNNwxuvT5GB5R0MkjzZ7Yg');
  var token = 'd60c06d54cc46d0ece57c1f1e3fc066a';

  router.use(function(req, res, done) {
    if (req.query.token == token) {
      done();
    }
    else {
      res.status(401);
      res.json({
        "error": "Authentication failed."
      });
    }
  });

  passport.use(new BasicStrategy(function(username, password, done) {
    User.findOne({
      where: {
        email: username
      }
    }).then(function(user) {
      if (!user) {
        return done(null, false);
      }

      if (user.validatePassword(password)) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));

  router.get('/signIn', passport.authenticate('basic', { session: false }), function(req, res) {
    // Passport authenticate
    res.json(req.user);
  });

  router.post('/FBLogIn', function(req, res) {
    var token = req.body.token;

    fbgraph.setAccessToken(token);

    fbgraph.get('me?fields=email,first_name,last_name', function(req, data) {
      User.findOrCreate({
        where: {
          email: data.email
        }
      }).spread(function(user, created) {
        if (created == true) {
          user.set('first_name', data.first_name);
          user.set('last_name', data.last_name);        
        }
        
        user.set('facebook', token);

        user.save().then(function(user) {
          res.json(user);
        });
      });
    });
  });

  // Users route
  var users = express.Router();

  users.post('/', function(req, res) {
    // Create a new user

    User.create(req.body).then(function(user) {
      res.json(user);
    });
  });

  users.route('/:id').get(function(req, res) {
    // Get a user by id
    User.findById(req.params.id).then(function(user) {
      res.json(user);
    });
  }).patch(function(req, res) {
    // Update user information
    User.findById(req.params.id).then(function(user) {
      user.updateAttributes(req.body).then(function(user) {
        res.json(user);
      });
    });
  }).delete(function(req, res) {
    // Delete a user
    User.findById(req.params.id).then(function(user) {
      user.destroy(req.body).then(function() {
        res.json({});
      });
    });
  });

  // Addresses route
  var userAddresses = express.Router({  mergeParams: true });

  userAddresses.route('/').get(function(req, res) {
    Address.findAll({
      where: {
        userId: req.params.userId
      }
    }).then(function(addresses) {
      res.json(addresses);
    });
  }).post(function(req, res) {
    var body = req.body;

    body.userId = req.params.userId;

    Address.create(body).then(function(address) {
      res.json(address);
    });
  });

  // Jobs route
  var userJobs = express.Router({ mergeParams: true });

  userJobs.route('/').get(function(req, res) {
    User.findById(req.params.userId).then(function(user) {
      var q = {};

      if (req.query.filter == 'upcoming') {
        q = {
          where: {
            start: { 
              $gt: new Date()
            }
          }
        };
      }
      else if (req.query.filter == 'past') {
        q = {
          where: {
            start: { 
              $lt: new Date()
            }
          }
        };
      }

      q.include = [
        { model: Company },
        { model: Address },
        { model: Coordinate },
        { 
          model: Bid,
          include: [{ model: Company }] 
        },
        { model: Review }
      ];

      q.order = [
        ['start', 'DESC']
      ];

      user.getJobs(q).then(function(jobs) {
        res.json(jobs);
      });
    });
  });

  users.use('/:userId/addresses', userAddresses);
  users.use('/:userId/jobs', userJobs);

  router.use('/users', users);

  var addresses = express.Router();

  addresses.route('/:id').get(function(req, res) {
    // Get a job by id
    Address.findById(req.params.id).then(function(address) {
      res.json(address);
    });
  }).patch(function(req, res) {
    // Update job info
    Address.findById(req.params.id).then(function(address) {
      address.updateAttributes(req.body).then(function(address) {
        res.json(address);
      });
    });
  }).delete(function(req, res) {
    // Delete a job
    Address.findById(req.params.id).then(function(address) {
      address.destroy(req.body).then(function() {
        res.json({});
      });
    });
  });

  router.use('/addresses', addresses);

  var jobs = express.Router();

  jobs.post('/', function(req, res) {
    // Create a job
    Job.create(req.body).then(function(job) {
      if (req.body.addressId) {
        Address.findById(req.body.addressId).then(function(address) {
          job.addAddress(address);
        });
      }
      else if (req.body.coordinate) {
        var coordinate = JSON.parse(req.body.coordinate);

        Coordinate.create(coordinate).then(function(coordinate) {
          job.addCoordinate(coordinate);
        });
      }

      /* User.findById(req.body.userId).then(function(user) {
        twilio.incomingPhoneNumbers.create({
          areaCode: '407'
        }, function(err, purchasedNumber) {
          if (err == null) {
            User.set('twilio_phone', purchasedNumber.phone_number);
          }
          else {
            console.log(err);
          }
        });
      }); */

      res.json(job);
    });
  });

  jobs.route('/:id').get(function(req, res) {
    // Get a job by id
    Job.findById(req.params.id, {
      include: [
        { model: Company },
        { model: Address },
        { model: Coordinate },
        { model: Bid }
      ]
    }).then(function(job) {
      res.json(job);
    });
  }).patch(function(req, res) {
    // Update job info
    Job.findById(req.params.id).then(function(job) {
      job.updateAttributes(req.body).then(function(job) {
        if (req.body.status == "I'm looking for help.") {
          console.log("Deleting: " + job.companyId);
          job.companyId = null;
        }

        job.save().then(function(job) {
          res.json(job);
        });
      });
    });
  }).delete(function(req, res) {
    // Delete a job
    Job.findById(req.params.id).then(function(job) {
      job.destroy(req.body).then(function() {
        res.json({});
      });
    });
  });

  var jobAddress = express.Router({ mergeParams: true });

  jobAddress.route('/').get(function(req, res) {
    Job.findById(req.params.jobId).then(function(job) {
      job.getAddresses().then(function(addresses) {
        res.json(addresses);
      });
    });
  });

  var jobCoordinate = express.Router({ mergeParams: true });

  jobCoordinate.route('/').get(function(req, res) {
    Job.findById(req.params.jobId).then(function(job) {
      job.getCoordinates().then(function(coordinate) {
        res.json(coordinate);
      });
    });
  });

  var jobBids = express.Router({ mergeParams: true });

  jobBids.route('/').get(function(req, res) {
    Job.findById(req.params.jobId).then(function(job) {
      job.getBids({
        include: [
          { model: Company }
        ]
      }).then(function(bids) {
        res.json(bids);
      });
    });
  });

  jobs.use('/:jobId/address', jobAddress);
  jobs.use('/:jobId/coordinate', jobCoordinate);
  jobs.use('/:jobId/bids', jobBids);

  router.use('/jobs', jobs);

  // Bids

  var bids = express.Router();

  bids.post('/', function(req, res) {
    Bid.create(req.body).then(function(bid) {
      res.json(bid);
    });
  });

  router.use('/bids', bids);

  // Companies
  router.post('/companies', function(req, res) {
    Company.create(req.body).then(function(company) {
      res.json(company);
    });
  });

  router.route('/companies/:id').get(function(req, res) {
    Company.findById(req.params.id, {
      include: [{ 
        model: Review,
        include: [{ model: User }]
      }]
    }).then(function(company) {
      res.json(company);
    });
  });

  // Reviews
  router.post('/reviews', function(req, res) {
    Review.create(req.body).then(function(review) {
      Job.findById(req.body.jobId).then(function(job) {
        job.set('status', 'All done.');

        job.save();
      });

      res.json(review);
    });
  });

  router.route('/reviews/:id').get(function(req, res) {
    Review.findById(req.params.id).then(function(review) {
      res.json(review);
    });
  });

  // Twiml

  router.post('/twiml_message', function(req, res) {
    var from = req.body.From;
    var message = req.body.Message;
    
    // Receiver
    User.findOne({
      where: {
        twilio_phone: req.body.To
      }
    }).then(function(receiver) {

      // Sender
      User.findOne({
        where: {
          phone: from
        }
      }).then(function(sender) {
        var twiml = new require('twilio').TwimlResponse();

        twiml.message(message, {
          to: receiver.phone,
          from: sender.twilio_phone
        });

        res.set('Content-Type', 'text/xml');
        res.send(twiml.toString());
      });
    });
  });

  router.post('/twiml_voice', function(req, res) {

  });

  router.get('/confirm_email', function(req, res) {
    User.findOne({
      where: {
        email_confirmation_token: req.query.token
      }
    }).then(function(user) {
      user.email_confirmation_token = null

      user.save().then(function(user) {
        res.set('Content-Type', 'text/plain');
        res.send('Your email has been confirmed!');
      });
    });
  });

  router.get('/confirm_phone', function(req, res) {
    User.findOne({
      where: {
        phone_confirmation_token: req.query.token
      }
    }).then(function(user) {
      user.phone_confirmation_token = null

      user.save().then(function(user) {
        res.set('Content-Type', 'text/plain');
        res.send('Your phone number has been confirmed!');
      });
    });
  });

  router.route('/reset_password').patch(function(req, res) {
    User.findOne({ 
      where: {
        email: req.body.email
      }
    }).then(function(user) {
      var hash = crypto.randomBytes(20).toString('hex');

      user.set('password_reset_token', hash);

      user.save().then(function(user) {
        var message = {
          "from_email": "support@gorapido.co",
          "from_name": "Support",
          "subject": "Reset your Rapido email.",
          "html": '<p>Click here to reset your password:</p><p>http://localhost:3000/v1/reset_password?token=' + hash + '</p>',
          "to": [{
            "email": user.email
          }]
        };

        mailer.messages.send({ message: message }, function(response) {
          res.json(response);
        }, function(err) {  
          console.log(err);
        });
      });
    });
  }).post(function(req, res) {
    if (req.query.token) {
      if (req.body.password == req.body.confirmPassword) {
        User.findById(req.query.user).then(function(user) {
          user.set('password', req.body.password);

          user.save().then(function(user) {
            res.set('Content-Type', 'text/plain');
            res.send('Your password has been successfully changed!');
          });
        });
      }
      else {
        res.set('Content-Type', 'text/plain');
        res.send('Uh oh! These passwords don\'t match. Please try again.');
      }
    }
    else {
      res.redirect('http://gorapido.co');
    }
  }).get(function(req, res) {
    if (req.query.token) {
      User.findOne({
        where: {
          password_reset_token: req.query.token
        }
      }).then(function(user) {
        res.render('password', {
          url: '/v1/reset_password?token=' + req.query.token + '&user=' + user.get('id')
        });
      });
    }
    else {
      res.redirect('http://gorapido.co');
    }
  });

  return router;
};
