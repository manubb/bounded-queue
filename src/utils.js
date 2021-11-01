const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const dataIdGenerator = (() => {
    let dataId = 0;
    return () => ++dataId;
})();

module.exports = { sleep, dataIdGenerator };
