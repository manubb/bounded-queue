const { sleep } = require("./utils");

const dataGenerator = (() => {
    let dataId = 0;
    return () => ++dataId;
})();

class Producer {
    constructor({ name, output, processingDuration }) {
        this.name = name;
        this.output = output;
        this.processingDuration = processingDuration;
    }

    async emitData(dataCount) {
        if (dataCount === 0) {
            return;
        }

        const data = dataGenerator();
        // simulate a data processing:
        await sleep(this.processingDuration);
        console.log(this.name, "pushes", data, "to", this.output.name);
        await this.output.push(data);
        console.log(
            this.name,
            "has pushed",
            data,
            "to",
            this.output.name
        );

        return this.emitData(dataCount - 1);
    }
}

module.exports = Producer;
