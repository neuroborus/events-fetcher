import fs from 'fs';
import config from './config.js';
import { addEvents } from './helpers/counter.js';

// Write logs to file
export const processLogs = async (logs, contract, fromBlock, toBlock) => {
    if (logs.length) {
        console.log(`Found ${logs.length} events.`);
        addEvents(logs.length);
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
    fs.appendFileSync(config.outputFile, record);
};

