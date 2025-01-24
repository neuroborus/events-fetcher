const { ethers } = require('ethers');
const fs = require('fs');

// Settings
const RPC_URL = 'https://rpc.ankr.com/bsc'; // RPC server URL
const CONTRACT_ADDRESS = '0xBbCD063efE506c3D42a0Fa2dB5C08430288C71FC'; // Contract address
// const EVENT_SIGNATURE = 'MarketAdded(address,address,uint256,uint256)'; // Event signature
const START_BLOCK = 33264762; // Start block
const END_BLOCK = 33284762; // End block (or "latest")

// Service Settings
const OUTPUT_FILE = 'events.txt'; // File for saving events
const BLOCKS_STEP = 3000;
const SLEEP_TIME_MS = 2000;

const ABI = require('./abi.json');


let eventsFound = 0;
// Write logs to file
async function writeLogs(logs, contract, fromBlock, toBlock) {
    if (logs.length) {
        console.log(`Found ${logs.length} events.`);
        eventsFound += logs.length;
    }

    // Decode each event
    const events = logs.map((log) => {
        const decoded = contract.interface.parseLog(log);
        const parsed = JSON.stringify(decoded, (key, value) => {
            return typeof value === 'bigint' ? value.toString() : value;
        })
        return parsed;
    });

    // Save events to file
    const record = `\nBLOCKS: ${fromBlock}-${toBlock}\n${JSON.stringify(events, null, 2)}`
    fs.appendFileSync(OUTPUT_FILE, record);
}

function getProgressPercents(block) {
    const path = END_BLOCK - START_BLOCK;
    const done = block - START_BLOCK;
    return (done / path * 100).toFixed(2);
}

async function fetchEvents() {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        // Get event topic (topic_0) if you need specific event
        // const topic0 = ethers.id(EVENT_SIGNATURE);
        // console.log(`Fetching events for signature: ${EVENT_SIGNATURE}`);
        // console.log(`Using topic0: ${topic0}`);

        console.log(`Start collecting [${START_BLOCK}-${END_BLOCK}]...`)
        const estimatedTimeMs = (END_BLOCK - START_BLOCK) / BLOCKS_STEP * SLEEP_TIME_MS;
        console.log(`Estimated time: ${(estimatedTimeMs / 1000 / 60).toFixed(2)} minutes.\n`);

        // Fetch logs in steps
        let block;
        for (block = START_BLOCK; block + BLOCKS_STEP < END_BLOCK; block += BLOCKS_STEP) {
            const fromBlock = block;
            const toBlock = block + BLOCKS_STEP;
            console.log(`(${getProgressPercents(block)}%) Collecting for [${fromBlock}-${toBlock}]`);
            const logs = await provider.getLogs({
                fromBlock,
                toBlock,
                address: CONTRACT_ADDRESS,
                // topics: [topic0],
            });
            await writeLogs(logs, contract, fromBlock, toBlock);
            await new Promise((resolve) => setTimeout(resolve, SLEEP_TIME_MS));
        }

        console.log(`(${getProgressPercents(block)}%) Collecting for [${block}-${END_BLOCK}]`);
        const logs = await provider.getLogs({
            fromBlock: block,
            toBlock: END_BLOCK,
            address: CONTRACT_ADDRESS,
            // topics: [topic0],
        });
        await writeLogs(logs, contract, block, END_BLOCK);

        console.info(`(100.00%) Finished - found ${eventsFound} events.`);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

fetchEvents();
