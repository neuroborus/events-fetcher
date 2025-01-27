import { mainAbi, additionalAbi } from '../../abis/index.js';
import config from '../config.js';

const combineAbis = (firstAbi, secondAbi) => {
    return [...firstAbi, ...secondAbi].filter((item, index, self) =>
        index === self.findIndex((t) => t.name === item.name && t.type === item.type)
    );
}

export const getAbi = () => {
    let abi;
    if (config.isCombinedAbi) {
        abi = combineAbis(mainAbi, additionalAbi);
    } else {
        abi = mainAbi;
    }
    return abi;
}
