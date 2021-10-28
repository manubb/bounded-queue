class Sink {
    constructor({ name }) {
        this.name = name;
    }

    push() {
        return Promise.resolve();
    }
}

module.exports = Sink;
