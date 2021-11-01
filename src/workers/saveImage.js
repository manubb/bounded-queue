const { expose } = require("threads/worker");
const { writeFile } = require("fs/promises");

const saveImage = ({ id, payload }) =>
    writeFile(`./images/${id}.jpeg`, payload).then(() => ({ id }));

expose(saveImage);
