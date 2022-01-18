const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Worker } = require('worker_threads');

const { waitForFreeThreads } = require('./utils')

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
  const { title, description } =  req.body;
  const processId = Math.floor(Math.random() * 10000) + 1000;
  
  await waitForFreeThreads(threads, processId);
  
  const worker = new Worker(__dirname + '/worker.js', {
    workerData: { 
      title,
      description,
    },
  });
  
  threads.push(worker.threadId);
  
  worker.on('message', (message) => {
    const index = threads.indexOf(worker.threadId);
    
    threads.splice(index, 1);
    
    res.status(200).json({ message });
  });
  worker.on('error', (err) => {
    res.status(500).json({ message: err.message });
  });
  worker.on('exit', (code) => {
    if (code !== 0) {
      res.status(500).json({ message: code });
    }
  });
  
  worker.postMessage(worker.threadId);
});

app.listen(4000, () => console.log(`Server app is listening on port 4000!`));