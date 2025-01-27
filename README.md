# events-fetcher
A simple script for parsing events from a smart contract.  
1. `npm ci`
2. Fill out the `.env` file using `.env.xmpl` as a template.
3. Populate your contracts ABI into `abis/main.abi.json`.
4. If you would like to combine it with another ABI (a rare case), populate `abis/additional.abi.json` with it.
3. `npm run start`

**If you are constantly getting nulls instead of valid events, check the provided ABIs.**

Expected output:
```
Start collecting [33264762-33284762]...
Estimated time: 0.22 minutes.

(0.00%) Collecting for [33264762-33267762]
Found 8 events.
(15.00%) Collecting for [33267762-33270762]
(30.00%) Collecting for [33270762-33273762]
(45.00%) Collecting for [33273762-33276762]
(60.00%) Collecting for [33276762-33279762]
(75.00%) Collecting for [33279762-33282762]
(90.00%) Collecting for [33282762-33284762]
(100.00%) Finished - found 8 events.
```