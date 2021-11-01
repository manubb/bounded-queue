const { expose, Transfer } = require("threads/worker");
const needle = require("needle");

const fetchImage = (id) => {
    return needle("get", "https://picsum.photos/1920/1080", { follow_max: 1 })
        .then((response) =>
            Transfer({ id, payload: response.raw.buffer }, [
                response.raw.buffer,
            ])
        )
        .catch((err) => {
            console.error(err);
        });
};

expose(fetchImage);
