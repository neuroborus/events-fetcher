import config from '../config.js';

export const getProgress = (currentBlock) => {
    // Returns progress in percents (string)
    const path = config.endBlock - config.startBlock;
    const done = currentBlock - config.startBlock;
    return (done / path * 100).toFixed(2);
};
