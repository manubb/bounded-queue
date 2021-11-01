const BoundedQueue = require("./src/BoundedQueue");
const Producer = require("./src/Producer");
const Sink = require("./src/Sink");
const Worker = require("./src/Worker");
const { sleep, dataIdGenerator } = require("./src/utils");

const queue1 = new BoundedQueue({
    name: "queue1",
    capacity: 5,
});

const queue2 = new BoundedQueue({
    name: "queue2",
    capacity: 5,
});

new Worker({
    name: "inner1",
    input: queue1,
    output: queue2,
    process: (data) => sleep(10).then(() => data),
}).start();

new Worker({
    name: "inner2",
    input: queue1,
    output: queue2,
    process: (data) => sleep(10).then(() => data),
}).start();

const sink = new Sink({ name: "the_sink" });

new Worker({
    name: "consumer1",
    input: queue2,
    output: sink,
    process: (data) => sleep(20).then(() => data),
}).start();

new Worker({
    name: "consumer2",
    input: queue2,
    output: sink,
    process: (data) => sleep(30).then(() => data),
}).start();

new Worker({
    name: "consumer3",
    input: queue2,
    output: sink,
    process: (data) => sleep(40).then(() => data),
}).start();

new Worker({
    name: "consumer4",
    input: queue2,
    output: sink,
    process: (data) => sleep(50).then(() => data),
}).start();

const producer1 = new Producer({
    name: "producer1",
    output: queue1,
    process: () => sleep(6).then(() => ({ id: dataIdGenerator() })),
});

const producer2 = new Producer({
    name: "producer2",
    output: queue1,
    process: () => sleep(5).then(() => ({ id: dataIdGenerator() })),
});

producer1.emitData(20);
producer2.emitData(20);
