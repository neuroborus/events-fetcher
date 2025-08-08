import fs from 'fs';
import config from './config.js';
import { addEvents } from './helpers/counter.js';

// Write logs to file
export const processLogs = async (logs, contract, fromBlock, toBlock, provider) => {
    if (logs.length) {
        console.log(`Found ${logs.length} events.`);
        addEvents(logs.length);
    }

    // Decode each event
    // Decode each event
    const events = await Promise.all(logs.map(async (log) => {
        const decoded = contract.interface.parseLog(log);
        
        // Extract block number, timestamp, transaction hash, and UTC date
        const blockNumber = log.blockNumber;
        const transactionHash = log.transactionHash;

        // Parse and include the extra details in the event
        const parsed = {
            blockNumber,
            transactionHash,
            event: JSON.stringify(decoded, (key, value) => {
                return typeof value === 'bigint' ? value.toString() : value;
            }),
        };

        return parsed;
    }));

    if (config.includeTimestamp) {
        const blocksTimestamps = new Map();
        for (const event of events) {
            if (!blocksTimestamps.has(event.blockNumber)) {
                const block = await provider.getBlock(event.blockNumber);
                blocksTimestamps.set(event.blockNumber, block.timestamp);
            }
            const ts = blocksTimestamps.get(event.blockNumber);
            event.timestamp = ts;
            event.date = new Date(ts * 1000).toISOString();
        }
    }

    // Save events to file
    const record = `BLOCKS: ${fromBlock}-${toBlock}\n\n` + events.map(event => {
        const ts = config.includeTimestamp ? `Timestamp: ${event.timestamp}\nDate: ${event.date}\n` : '';

        return `Block: ${event.blockNumber}\n${ts}TxHash: ${event.transactionHash}\nEvent:\n${event.event}`;
    }).join('\n\n') + '\n\n\n';
    fs.appendFileSync(config.outputFile, record);
};

