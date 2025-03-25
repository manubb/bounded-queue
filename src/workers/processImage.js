const { expose, Transfer } = require("threads/worker");
const { Jimp } = require("jimp");

const processImage = ({ id, payload }) =>
    Jimp.read(payload)
        .then((image) =>
            image
                .greyscale()
                .sepia()
                .cover({ w: 1280, h: 720 })
                .getBuffer("image/jpeg", { quality: 60 })
        )
        .then((typedArray) =>
            Transfer({ id, payload: typedArray }, [typedArray.buffer])
        );

expose(processImage);
