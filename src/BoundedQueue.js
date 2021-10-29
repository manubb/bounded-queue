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
            this.onEnqueuedProducerCallback();
        });
    }

    pull() {
        return new Promise((resolve) => {
            this.consumerCallbacks.enqueue(resolve);
            this.onEnqueuedConsumerCallback();
        });
    }

    satisfyOldestConsumer() {
        const data = this.ringBuffer.deq();
        const size = `(size: ${this.ringBuffer.size()})`;
        console.log(this.name, "has dequeued", data, size);
        this.consumerCallbacks.dequeue()(data);
    }

    satisfyOldestProducer() {
        const data = this.producerCallbacks.dequeue()();
        this.ringBuffer.enq(data);
        const size = `(size: ${this.ringBuffer.size()})`;
        console.log(this.name, "has enqueued", data, size);
    }

    onEnqueuedProducerCallback() {
        if (!this.ringBuffer.isFull()) {
            this.satisfyOldestProducer();
            if (!this.consumerCallbacks.isEmpty()) {
                this.satisfyOldestConsumer();
            }
        }
    }

    onEnqueuedConsumerCallback() {
        if (!this.ringBuffer.isEmpty()) {
            this.satisfyOldestConsumer();
            if (!this.producerCallbacks.isEmpty()) {
                this.satisfyOldestProducer();
            }
        }
    }
}

module.exports = BoundedQueue;
