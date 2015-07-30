module.exports = function(router) {
  var models = require('./models');
  var User = models.User,
    Job = models.Job;

  router.post('/log_in', function(req, res) {
    // Passport authenticate
  });

  router.post('/log_out', function(req, res) {
    // Kill Passport session
  });

  router.get('/current_user', function(req, res) {
    // Get current user in session
  });

  router.post('/users', function(req, res) {
    // Create a new user
    User.create(req.body).then(function(user) {
      res.json(user);
    });
  });

  router.route('/users/:id').get(function(req, res) {
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

  /*
  router.route('/users/:user_id/jobs').get(function(req, res) {

  }).post(function(req, res) {

  });

  router.route('/users/:user_id/jobs/:id').get(function(req, res) {

  }).patch(function(req, res) {

  }).delete(function(req, res) {

  });
  */

  router.route('/jobs').post(function(req, res) {
    // Get a list of jobs via a query
    Job.create(req.body).then(function(job) {
      res.json(job);
    });
  });

  router.route('/jobs/:id').get(function(req, res) {
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

  return router;
};
