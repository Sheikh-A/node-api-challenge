const express = require('express');
const Projects = require('../data/helpers/projectModel.js');
const Actions = require('../data/helpers/actionModel.js');
const morgan = require('morgan');
const mw = require('../common/middleware.js');
const logger = mw.logger;
//const validateId = mw.validateId;
const validatePostId = mw.validatePostId;
const validatePost = mw.validatePost;
const helmet = require('helmet');

const router = express.Router();
router.use(morgan("dev"));
router.use(logger);
router.use(helmet());

router.use((req, res, next) => {
    console.log(req.name);
    console.log('inside projects router');
    next();
});

// this only runs if the url has /api/projects in it
router.get('/', (req,res) => {
    Projects.get()
      .then(project => {
          res.status(200).json({
            greet: process.env.GREET,  
            project});
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Error getting projects" });
      });
});

router.get('/:id', validateId, (req,res) => {
    const { id } = req.params;
    Projects.get(id)
      .then(project => {
          res.status(200).json(project);
      })
      .catch(err => {
          res.status(500).json({ message: "Error getting project with id" });
      });
});

router.post('/', requriedBody, (req,res) => {
    const body = req.body;
    Projects.insert(req.body)
      .then(project => {
          res.status(201).json(project);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              message: "Error adding project"
          });
      });
});

router.put('/:id', validateId,requriedBody, (req,res) => {
    
    const { id } = req.params;
    const body = req.body;
    
    Projects.update(id, body)
      .then(update => {
          if(update) {
              res.status(200).json(update);
          } else {
              res.status(404).json({ message: "Project cannot be found" });
          }
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              message: "Error updating project"
          });
      });
});


router.delete('/:id', validateId, (req,res) => {
    const { id } = req.params;
    Projects.remove(id)
      .then(project => {
          res.status(200).json({ message: `You deleted post ${id}` });
      })
      .catch(err => {
          res.status(500).json({message: `Project ${id} could not be deleted`});
      });
});

router.get('/:id/actions', validateId, (req,res) => {
    const { id } = req.params;

    Projects.getProjectActions(id)
      .then(actions => {
          res.status(200).json({actions});
      })
      .catch(err =>{
          console.log(err);
          res.status(500).json({
              message:"Error getting actions for project"
          });
      });
});


//Middleware
function requriedBody(req, res, next) {
    const body = req.body;
    if(body.name && body.description) {
        console.log("Thank you");
        next();
    } else {
        res.status(400).json({ message:"Please include correct name and description" });
    }
}

function validateId(req, res, next) {
    const { id } = req.params;

    Projects.get(id)
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


module.exports = router;



