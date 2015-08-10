module.exports = function(router) {
  var express = require('express'),
    passport = require('passport');
  var BasicStrategy = require('passport-http').BasicStrategy;
  var models = require('./models');
  var User = models.User,
    Address = models.Address,
    Coordinate = models.Coordinate,
    Job = models.Job;

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
    Job.findAll({
      include: [{
        model: Address,
        where: {
          userId: req.params.userId
        }
      }]
    }).then(function(jobs) {
      res.json(jobs);
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

      res.json(job);
    });
  });

  jobs.route('/:id').get(function(req, res) {
    // Get a job by id
    Job.findById(req.params.id).then(function(job) {
      res.json(job);
    });
  }).patch(function(req, res) {
    // Update job info
    Job.findById(req.params.id).then(function(job) {
      job.updateAttributes(req.body).then(function(job) {
        res.json(job);
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

  jobs.use('/:jobId/address', jobAddress);
  jobs.use('/:jobId/coordinate', jobCoordinate);

  router.use('/jobs', jobs);

  return router;
};
