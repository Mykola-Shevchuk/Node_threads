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

const statuses = {
  connectingToTheRestaurant: 'Connecting To The Restaurant',
  restaurantIsPlacingOrder: 'Restaurant is placing your order',
  restaurantIsReady: 'Restaurant is ready to cook your meal',
  lookingForCourier: 'Looking for Courier',
  courierIsFound: 'Courier is found',
  orderSuccess: 'Order is successfully processed',
  orderFailed: 'Failed to process order'
};

function getPercentsByStatus(status) {
  const max = 100;
  if (status === statuses.orderFailed) {
    return max;
  }

  const statusesCollection = Object.values(statuses);
  const statusIndex = statusesCollection.indexOf(status);
  return (max / (Object.keys(statuses).length - 1)) * (statusIndex + 1);
}

module.exports = {
  getTime,
  waitForFreeThreads,
  statuses,
  getPercentsByStatus,
}