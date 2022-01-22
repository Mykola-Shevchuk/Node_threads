const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Worker } = require('worker_threads');
const { waitForFreeThreads} = require('./utils')
const {sequelize} = require("./sequelize.config");
const {Order} = require("./order.model");

// Init app
const app = express();

// Cors
app.use(cors());

// Define BodyParser
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

/* Threads poll */
const threads = [];

/* Order's request */
app.post('/order', async (req, res) => {
  const { title, description, id } =  req.body;
  const processId = Math.floor(Math.random() * 10000) + 1000;
  
  await waitForFreeThreads(threads, processId);
  
  const worker = new Worker(__dirname + '/worker.js', {
    workerData: { 
      title,
      description,
    },
  });
  
  threads.push(worker.threadId);
  
  worker.on('message', async (message) => {
    const index = threads.indexOf(worker.threadId);
    threads.splice(index, 1);
    res.status(200).json({ message });
    setTimeout(async () => {
      await Order.destroy({ where: {id}})
    }, 1000);

  });
  worker.on('error', (err) => {
    res.status(500).json({ message: err.message });
  });
  worker.on('exit', (code) => {
    if (code !== 0) {
      res.status(500).json({ message: code });
    }
  });
  console.log(worker);
  worker.postMessage({ threadId: worker.threadId, itemId: id } );
});

app.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ where: {id}});
    res.status(200).json({status: order?.status || '', progress: order?.progress || 0})
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
})

app.listen(4000, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`Server app is listening on port 4000!`)
});
