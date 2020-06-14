const express = require('express');
const Actions = require('../data/helpers/actionModel.js');
const Projects = require('../data/helpers/projectModel.js');
const Mappers = require('../data/helpers/mappers.js');
const morgan = require('morgan');
const helmet = require('helmet');
const mw = require('../common/middleware.js');
const logger = mw.logger;
const validateId = mw.validateId;
const validatePostId = mw.validatePostId;
const validatePost = mw.validatePost;


const router = express.Router();
router.use(morgan("dev"));
router.use(logger);
router.use(helmet());

router.use((req,res,next) => {
    console.log(req.name);
    console.log('inside the actions router');
    next();
});

// this only runs if the url has /api/actions in it
router.get('/', (req, res) => {
    Actions.get()
      .then(action => {
          res.status(200).json({
            motd: process.env.MOTD,  
            action
            });
      })
      .catch(error => {
          console.log(error);
          res.status(500).json({
              message: "Error getting action"
          });
      });
});

router.get('/:id', validateId, (req,res) => {
    res.status(200).json(req.action);
});

router.post('/', requiredBody,  (req,res) => {
    const body = req.body;

    Actions.insert(req.body)
      .then(action => {
          res.status(201).json(action);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              message: "Error posting action"
          });
      });
});

router.put('/:id', validateId, requiredBody, (req, res) => {
    const { id } = req.params;
    const body = req.body;
    Actions.update(id, body)
      .then(action => {
          if(action) {
              res.status(200).json(action);
          } else {
            res.status(404).json({ message: "PUT: Id not found" });
          }
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              message: "Error PUT Action"
          });
      });
});

router.delete('/:id', validateId, (req,res) =>{
    const { id } = req.params;
    Actions.remove(id)
      .then(del => {
          if(del) {
              res.status(200).json({ message: `You deleted post ${id}`});
          } else {
              res
                .status(404)
                .json({ message: `Post with ${id} does not exist ` });
          }
      })
      .catch(err => {
          res.status(500).json({ error: "The action could not be deleted" });
      });
});


function requiredBody(req,res,next) {
  const body = req.body;

  if(!body || body === {}) {
      res.status(400).json({ message: "Please include request body" });
  } else if (!body.project_id) {
    res.status(400).json({ message: "Please include project_id" });
  } else if (!body.description) {
    res.status(400).json({ message: "Please include description body" });
  } else if (body.completed === {}) {
    res.status(400).json({ message: "Please include completed body" });
  } else {
      next();
  }
 
}







module.exports = router;


/*
module.exports = {
    get,
    insert,
    update,
    remove,
  };
  
  function get(id) {
    let query = db('actions');
  
    if (id) {
      return query
        .where('id', id)
        .first()
        .then((action) => {
          if (action) {
            return mappers.actionToBody(action);
          } else {
            return null;
          }
        });
    } else {
      return query.then((actions) => {
        return actions.map((action) => mappers.actionToBody(action));
      });
    }
  }
  
  function insert(action) {
    return db('actions')
      .insert(action, 'id')
      .then(([id]) => get(id));
  }
  
  function update(id, changes) {
    return db('actions')
      .where('id', id)
      .update(changes)
      .then((count) => (count > 0 ? get(id) : null));
  }
  
  function remove(id) {
    return db('actions').where('id', id).del();
  }
  */