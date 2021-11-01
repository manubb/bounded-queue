const { mkdirSync } = require("fs");

const BoundedQueue = require("./src/BoundedQueue");
const Producer = require("./src/Producer");
const Sink = require("./src/Sink");
const Worker = require("./src/Worker");
const { spawn, Transfer, Worker: ThreadWorker } = require("threads");
const { dataIdGenerator } = require("./src/utils");

mkdirSync("images", { recursive: true });

const queue1 = new BoundedQueue({
    name: "queue1",
    capacity: 5,
});

const queue2 = new BoundedQueue({
    name: "queue2",
    capacity: 5,
});

spawn(new ThreadWorker("./src/workers/processImage")).then((processImage) => {
    const process = (data) => processImage(Transfer(data, [data.payload]));

    new Worker({
        name: "inner1",
        input: queue1,
        output: queue2,
        process,
    }).start();
});

spawn(new ThreadWorker("./src/workers/processImage")).then((processImage) => {
    const process = (data) => processImage(Transfer(data, [data.payload]));

    return new Worker({
        name: "inner2",
        input: queue1,
        output: queue2,
        process,
    }).start();
});

const sink = new Sink({ name: "the_sink" });

spawn(new ThreadWorker("./src/workers/saveImage")).then((saveImage) => {
    const process = (data) => saveImage(Transfer(data, [data.payload.buffer]));
    new Worker({
        name: "consumer1",
        input: queue2,
        output: sink,
        process,
    }).start();
});

spawn(new ThreadWorker("./src/workers/saveImage")).then((saveImage) => {
    const process = (data) => saveImage(Transfer(data, [data.payload.buffer]));
    new Worker({
        name: "consumer2",
        input: queue2,
        output: sink,
        process,
    }).start();
});

spawn(new ThreadWorker("./src/workers/saveImage")).then((saveImage) => {
    const process = (data) => saveImage(Transfer(data, [data.payload.buffer]));
    new Worker({
        name: "consumer3",
        input: queue2,
        output: sink,
        process,
    }).start();
});

spawn(new ThreadWorker("./src/workers/saveImage")).then((saveImage) => {
    const process = (data) => saveImage(Transfer(data, [data.payload.buffer]));
    new Worker({
        name: "consumer4",
        input: queue2,
        output: sink,
        process,
    }).start();
});

spawn(new ThreadWorker("./src/workers/fetchImage")).then((fetchImage) =>
    new Producer({
        name: "producer1",
        output: queue1,
        process: () => fetchImage(dataIdGenerator()),
    }).emitData(20)
);

spawn(new ThreadWorker("./src/workers/fetchImage")).then((fetchImage) =>
    new Producer({
        name: "producer2",
        output: queue1,
        process: () => fetchImage(dataIdGenerator()),
    }).emitData(20)
);
