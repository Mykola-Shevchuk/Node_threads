const {parentPort, workerData, Worker} = require('worker_threads');
const {existsSync, readFileSync, writeFileSync} = require('fs')
const {getTime, statuses, getPercentsByStatus} = require('./utils');
const {Order} = require("./order.model");

const path = 'log-file.log';

parentPort.on('message', async ({threadId, itemId}) => {
    try {
        const responseMessage = 'Processed successfully!';
        const foodName = workerData.title;
        const startLog = `${getTime()}  THREAD ID:${threadId}  Start Processing ${foodName}.\r\n`
        await writeLog(startLog);
        await connectToRestaurant(threadId, foodName, itemId);
        await connectToCourier(threadId, foodName, itemId);
        const endLog = `${getTime()}  THREAD ID:${threadId}  End Processing ${foodName}.\r\n`
        await writeLog(endLog);
        parentPort.postMessage(responseMessage);
    } catch (e) {
        parentPort.postMessage('Failed To Process Your Order');
    }
});

async function connectToRestaurant(threadId, foodName, itemId) {
    await writeLog(`${getTime()}  THREAD ID:${threadId} ${statuses.connectingToTheRestaurant}: ${foodName}.\r\n`);
    await updateStatus(itemId, foodName, statuses.connectingToTheRestaurant);
    await emulateBackendCall();
    await updateStatus(itemId, foodName, statuses.restaurantIsPlacingOrder);
    await writeLog(`${getTime()}  THREAD ID:${threadId}   ${statuses.restaurantIsPlacingOrder}: ${foodName}.\r\n`);
    await emulateBackendCall();
    await updateStatus(itemId, foodName, statuses.restaurantIsReady);
    await writeLog(`${getTime()}  THREAD ID:${threadId}   ${statuses.restaurantIsReady}: ${foodName}.\r\n`);
}

async function connectToCourier(threadId, foodName, itemId) {
    await writeLog(`${getTime()}  THREAD ID:${threadId} ${statuses.lookingForCourier}: ${foodName}.\r\n`);
    await updateStatus(itemId, foodName, statuses.lookingForCourier);
    await emulateBackendCall();
    await updateStatus(itemId, foodName, statuses.courierIsFound);
    await writeLog(`${getTime()}  THREAD ID:${threadId}   ${statuses.courierIsFound}: ${foodName}.\r\n`);
    await emulateBackendCall();
    await updateStatus(itemId, foodName, statuses.orderSuccess);
    await writeLog(`${getTime()}  THREAD ID:${threadId}   ${statuses.orderSuccess}: ${foodName}.\r\n`);
}

function writeLog(log) {
    const data = !existsSync(path) ? '' : readFileSync(path, {encoding: 'utf-8'});
    writeFileSync(path, data + log);
}

async function updateStatus(itemId, foodName, status) {
    const model = {
        id: itemId,
        name: foodName,
        progress: Math.round(getPercentsByStatus(status)),
        status: status
    };
    const orderExists = await Order.findOne({where: {id: itemId}});
    if (!orderExists) {
        await Order.create({id: itemId, ...model})
    } else {
        await Order.update(model, {where: {id: itemId}});
    }
}

function emulateBackendCall() {
    const timeout = Math.floor(Math.random() * 5000);
    return new Promise(
        resolve => setTimeout(resolve, timeout));
}