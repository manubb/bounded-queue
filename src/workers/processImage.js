const { expose, Transfer } = require("threads/worker");
const Jimp = require("jimp");

const processImage = ({ id, payload }) => {
    return Jimp.read(payload)
        .then((image) =>
            image
                .greyscale()
                .sepia()
                .cover(1280, 720)
                .quality(60)
                .getBufferAsync(Jimp.AUTO)
        )
        .then((typedArray) =>
            Transfer({ id, payload: typedArray }, [typedArray.buffer])
        )
        .catch((err) => console.error(err));
};

expose(processImage);
