const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const projectsRouter = require('./routers/projects-router.js');
const actionsRouter = require('./routers/actions-router.js');
//const morgan = require('morgan');

const server = express();

server.use(morgan("dev"));
server.use(helmet());

server.use(express.json());
server.use("/api/projects", projectsRouter);
server.use("/api/actions", actionsRouter);

server.get('/', (req,res) => {
    res.send(`
    <h2>Sprint Challenge API</h2>
    <p>Welcome to Ali's the Sprint API Challenge</p>`);
});

//server.use(notFound);

module.exports = server;
