const { parentPort, workerData } = require('worker_threads');
const { readFile, writeFile, existsSync } = require('fs')

const { getTime } = require('./utils')

parentPort.on('message', async (threadId) => {
  const timeout = Math.floor(Math.random() * 20000);
  const responseMessage = 'Processed successfully!';
  
  const data = await new Promise(resolve => {
    setTimeout(async () => {
      const path = 'log-file.log';
      const foodName = workerData.title;
      
      if (!existsSync(path)) {
        const time = getTime();
        const log = `${time}  THREAD ID:${threadId}  Processed ${foodName}.\r\n`

        await writeFile(path, log, (err) => {
          if (err) {
            return resolve('error')
          }
        })

        return resolve(responseMessage);
      }
      
      readFile(path, 'utf-8', async (err, data) => {
        if (err) {
          return resolve('error');
        }

        const time = getTime();
        const log = `${data}${time}  THREAD ID:${threadId}  Processed ${foodName}.\r\n`

        await writeFile(path, log, (err) => {
          if (err) {
            return resolve('error')
          }

          return resolve(responseMessage);
        })
      })
    }, timeout);
  })
  
  parentPort.postMessage(data);
});