const { sleep } = require("./utils");

class Worker {
    constructor({ name, input, output, processingDuration }) {
        this.name = name;
        this.input = input;
        this.output = output;
        this.processingDuration = processingDuration;
    }

    async start() {
        console.log(this.name, "requests data from", this.input.name);
        const data = await this.input.pull();
        console.log(this.name, "has received", data, "from", this.input.name);
        // simulate a data processing:
        await sleep(this.processingDuration);
        console.log(this.name, "pushes", data, "to", this.output.name);
        await this.output.push(data);
        console.log(
            this.output.name,
            "has acknowledged reception of",
            data,
            "to",
            this.name
        );

        return this.start();
    }
}

module.exports = Worker;
