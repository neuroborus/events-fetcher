import { ethers } from 'ethers';

import config from './config.js';
import { getAbi } from './helpers/abi.js';
import { getEventsValue } from './helpers/counter.js';
import { getProgress } from './helpers/progress.js';
import { processLogs } from './processor.js';


async function fetchEvents() {
    try {
        const abi = getAbi();
        const provider = new ethers.JsonRpcProvider(config.rpcUrl);
        const contract = new ethers.Contract(config.contractAddress, abi, provider);

        let topic0 = null;
        if (config.eventSignature) {
            // Get event topic (topic_0) if you need specific event
            topic0 = ethers.id(config.eventSignature);
            console.log(`Fetching events for signature: ${config.eventSignature}`);
            console.log(`Using topic0: ${topic0}`);
        }

        console.log(`Start collecting [${config.startBlock}-${config.endBlock}]...`)
        const estimatedTimeMs = (config.endBlock - config.startBlock) / config.blocksStep * config.sleepTimeMs;
        console.log(`Estimated time: ${(estimatedTimeMs / 1000 / 60).toFixed(2)} minutes.\n`);

        // Fetch logs in steps
        let block;
        for (block = config.startBlock; block + config.blocksStep < config.endBlock; block += config.blocksStep) {
            const fromBlock = block;
            const toBlock = block + config.blocksStep;
            console.log(`(${getProgress(block)}%) Collecting for [${fromBlock}-${toBlock}]`);
            const logs = await provider.getLogs({
                fromBlock,
                toBlock,
                address: config.contractAddress,
                topics: topic0 ? [topic0] : undefined,
            });
            await processLogs(logs, contract, fromBlock, toBlock);
            await new Promise((resolve) => setTimeout(resolve, config.sleepTimeMs));
        }

        // Final step
        console.log(`(${getProgress(block)}%) Collecting for [${block}-${config.endBlock}]`);
        const logs = await provider.getLogs({
            fromBlock: block,
            toBlock: config.endBlock,
            address: config.contractAddress,
            topics: topic0 ? [topic0] : undefined,
        });
        await processLogs(logs, contract, block, config.endBlock);

        console.info(`(100.00%) Finished - found ${getEventsValue()} events.`);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

fetchEvents();
