class Worker {
    constructor({ name, input, output, process }) {
        this.name = name;
        this.input = input;
        this.output = output;
        this.process = process;
    }

    async start() {
        console.log(this.name, "pulls data from", this.input.name);
        const data = await this.input.pull();
        const { id } = data;
        console.log(this.name, "has pulled", id, "from", this.input.name);
        const processedData = await this.process(data);
        console.log(this.name, "pushes", id, "to", this.output.name);
        await this.output.push(processedData);
        console.log(this.name, "has pushed", id, "to", this.output.name);

        return this.start();
    }
}

module.exports = Worker;
