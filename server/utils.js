const getTime = () => {
  const date = new Date();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

  return `${hours}:${minutes}:${seconds}`
};

const waitForFreeThreads = (threads, processId) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (threads.length <= 2) {
        clearInterval(interval);

        return resolve();
      }
      
      console.log(`Waiting for the free threads for process: ${processId}...`)

    }, 500);
  })
}

module.exports = {
  getTime,
  waitForFreeThreads,
}