const BoundedQueue = require("./src/BoundedQueue");
const Producer = require("./src/Producer");
const Sink = require("./src/Sink");
const Worker = require("./src/Worker");

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
    processingDuration: 10,
}).start();

new Worker({
    name: "inner2",
    input: queue1,
    output: queue2,
    processingDuration: 10,
}).start();

const sink = new Sink({ name: "the_sink" });

new Worker({
    name: "consumer1",
    input: queue2,
    output: sink,
    processingDuration: 20,
}).start();

new Worker({
    name: "consumer2",
    input: queue2,
    output: sink,
    processingDuration: 30,
}).start();

new Worker({
    name: "consumer3",
    input: queue2,
    output: sink,
    processingDuration: 40,
}).start();

new Worker({
    name: "consumer4",
    input: queue2,
    output: sink,
    processingDuration: 50,
}).start();

const producer1 = new Producer({
    name: "producer1",
    output: queue1,
    processingDuration: 6,
});

const producer2 = new Producer({
    name: "producer2",
    output: queue1,
    processingDuration: 5,
});

producer1.emitData(20);
producer2.emitData(20);
