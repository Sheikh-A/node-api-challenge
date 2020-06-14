
const Actions = require('../data/helpers/actionModel.js');
const Projects = require('../data/helpers/projectModel.js');

function logger(req, res, next) {
    const method = req.method;
    const endpoint = req.originalUrl;
    const dates = [new Date().toISOString()];
    console.log(`Date: ${dates}, ${method} to ${endpoint}`);
    next();
}


function validateId(req, res, next) {
    const { id } = req.params;

    Actions.get(id)
      .then(action => {
          if(action) {
              req.action = action;
              next();
          } else {
              res.status(404).json({ message: "Correct ID not found" });
          }
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Failed to retrieve from DB", err  });
      });
}

function validatePost(req, res, next) {
    const body = req.body;
    !body || body === {} ?
      res.status(400).json({ message: "Please include request body" })
    : next();
}

function validatePostId(req, res, next) {
    const { id } = req.params;

    Projects.get(id)
      .then(projects => {
          if(projects) {
              req.projects = projects
              next();
          } else if (!projects) {
              res.status(400).json({ message: "Invalid User ID" });
          } else {
              next();
          }
      })
}

module.exports = {

    logger,
    validateId,
    validatePost,
    validatePostId,

}