const Queue = require("queue-fifo");
const RingBufferJS = require("ringbufferjs");

class BoundedQueue {
    // A passive bounded waiting queue:
    // - Producers need to push their data to the queue
    // - Consumers need to pull data from the queue
    constructor({ name, capacity }) {
        this.name = name;
        this.ringBuffer = new RingBufferJS(capacity);
        this.producerCallbacks = new Queue();
        this.consumerCallbacks = new Queue();
    }

    push(data) {
        return new Promise((resolve) => {
            this.producerCallbacks.enqueue(() => {
                resolve();
                return data;
            });
            this.updateState();
        });
    }

    pull() {
        return new Promise((resolve) => {
            this.consumerCallbacks.enqueue((data) => {
                resolve(data);
            });
            this.updateState();
        });
    }

    satisfyOldestConsumer() {
        const data = this.ringBuffer.deq();
        console.log(
            data,
            "has been dequeued from",
            this.name,
            `(${this.ringBuffer.size()})`
        );
        this.consumerCallbacks.dequeue()(data);
    }

    satisfyOldestProducer() {
        const data = this.producerCallbacks.dequeue()();
        this.ringBuffer.enq(data);
        console.log(
            data,
            "has been enqueued in",
            this.name,
            `(${this.ringBuffer.size()})`
        );
    }

    updateState() {
        // We eagerly satisfy as many consumers and producers as possible:
        while (
            !this.consumerCallbacks.isEmpty() &&
            !this.ringBuffer.isEmpty()
        ) {
            this.satisfyOldestConsumer();
        }

        while (!this.producerCallbacks.isEmpty() && !this.ringBuffer.isFull()) {
            this.satisfyOldestProducer();
            // The buffer is not empty now and we can satisfy a consumer
            if (!this.consumerCallbacks.isEmpty()) {
                this.satisfyOldestConsumer();
            }
        }
    }
}

module.exports = BoundedQueue;
