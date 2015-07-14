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
    new User(req.body).save().then(function(user) {
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
      user.update(req.body.params).then(function(user) {
        res.json(user);
      });
    });
  }).delete(function(req, res) {
    // Delete a user
    User.deleteById(req.params.id).then(function(user) {
      res.json(user);
    });
  });

  router.route('/users/:user_id/jobs').get(function(req, res) {

  }).post(function(req, res) {

  });

  router.route('/users/:user_id/jobs/:id').get(function(req, res) {

  }).patch(function(req, res) {

  }).delete(function(req, res) {

  });

  router.route('/jobs').get(function(req, res) {
    // Get a list of jobs via a query
  }).post(function(req, res) {
    // Create a new job request
  });

  router.route('/jobs/:id').get(function(req, res) {
    // Get a job by id
  }).patch(function(req, res) {
    // Update job info
  }).delete(function(req, res) {
    // Delete a job
  });

  return router;
};