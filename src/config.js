import { config } from 'dotenv';
config();

const missEnvError = (envName) => new Error(`Required ENV not found: ${envName}`);

const rpcUrl = process.env.RPC_URL;
if (!rpcUrl) throw missEnvError('RPC_URL');

const contractAddress = process.env.CONTRACT_ADDRESS;
if (!contractAddress) throw missEnvError('CONTRACT_ADDRESS');

const startBlock = process.env.START_BLOCK;
if (!startBlock) throw missEnvError('START_BLOCK');

const endBlock = process.env.END_BLOCK;
if (!endBlock) throw missEnvError('END_BLOCK');

const outputFile = process.env.OUTPUT_FILE || 'events.txt';

const blocksStep = process.env.BLOCKS_STEP;

const sleepTimeMs = process.env.SLEEP_TIME_MS;

const isCombinedAbi = process.env.IS_COMBINED_ABI;

const eventSignature = process.env.EVENT_SIGNATURE;

export default {
    rpcUrl,
    contractAddress,
    startBlock: parseInt(startBlock, 10),
    endBlock: parseInt(endBlock, 10),
    outputFile,
    blocksStep: blocksStep ? parseInt(blocksStep, 10) : 3000,
    sleepTimeMs: sleepTimeMs ? parseInt(sleepTimeMs, 10) : 1000,
    isCombinedAbi: (isCombinedAbi && isCombinedAbi.toLowerCase === 'true') ? true : false,
    eventSignature,
}
