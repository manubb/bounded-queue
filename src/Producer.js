class Producer {
    constructor({ name, output, process }) {
        this.name = name;
        this.output = output;
        this.process = process;
    }

    async emitData(dataCount) {
        if (dataCount === 0) {
            return;
        }

        const data = await this.process();
        console.log(this.name, "pushes", data.id, "to", this.output.name);
        await this.output.push(data);
        console.log(this.name, "has pushed", data.id, "to", this.output.name);

        return this.emitData(dataCount - 1);
    }
}

module.exports = Producer;
