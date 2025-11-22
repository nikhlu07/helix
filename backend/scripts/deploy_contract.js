// Hedera Smart Contract Deployment Script (Node.js)
require('dotenv').config({ path: '../../.env' });
const {
    Client,
    AccountId,
    PrivateKey,
    ContractCreateFlow,
    Hbar
} = require('@hashgraph/sdk');
const fs = require('fs');
const solc = require('solc');
const path = require('path');

async function deployContract() {
    console.log('🚀 Starting Hedera Smart Contract Deployment...\n');

    try {
        // 1. Initialize Client
        const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
        const privateKey = PrivateKey.fromStringED25519(process.env.HEDERA_PRIVATE_KEY);

        const client = Client.forTestnet();
        client.setOperator(accountId, privateKey);
        client.setMaxTransactionFee(new Hbar(50)); // Set max fee on client

        console.log(`✅ Client initialized on testnet`);
        console.log(`📍 Account ID: ${accountId}`);

        // 2. Compile Contract
        console.log('\n🔨 Compiling Procurement.sol...');
        const contractPath = path.join(__dirname, '..', '..', 'contracts', 'Procurement.sol');
        const source = fs.readFileSync(contractPath, 'utf8');

        const input = {
            language: 'Solidity',
            sources: {
                'Procurement.sol': {
                    content: source
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode']
                    }
                }
            }
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input)));

        if (output.errors) {
            const errors = output.errors.filter(e => e.severity === 'error');
            if (errors.length > 0) {
                console.error('❌ Compilation errors:');
                errors.forEach(err => console.error(err.formattedMessage));
                process.exit(1);
            }
        }

        const contract = output.contracts['Procurement.sol']['Procurement'];
        const bytecode = contract.evm.bytecode.object;
        const abi = contract.abi;

        console.log('✅ Compilation successful');
        console.log(`📦 Bytecode size: ${bytecode.length / 2} bytes`);

        // Save ABI
        const abiPath = path.join(__dirname, 'Procurement_ABI.json');
        fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
        console.log(`💾 ABI saved to ${abiPath}`);

        // 3. Deploy Contract
        console.log('\n📤 Deploying contract to Hedera network...');
        console.log('⏳ This may take 10-20 seconds...');

        const contractCreate = new ContractCreateFlow()
            .setBytecode(bytecode)
            .setGas(4000000); // Gas set to 4 million

        const txResponse = await contractCreate.execute(client);
        const receipt = await txResponse.getReceipt(client);
        const contractId = receipt.contractId;

        console.log('\n🎉 Contract Deployed Successfully!');
        console.log('═══════════════════════════════════════');
        console.log(`📜 Contract ID: ${contractId}`);
        console.log(`🔗 Explorer: https://hashscan.io/testnet/contract/${contractId}`);
        console.log('═══════════════════════════════════════\n');

        // Update .env file
        const envPath = path.join(__dirname, '..', '..', '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('HEDERA_CONTRACT_ID=')) {
            envContent = envContent.replace(
                /HEDERA_CONTRACT_ID=.*/,
                `HEDERA_CONTRACT_ID=${contractId}`
            );
        } else {
            envContent += `\nHEDERA_CONTRACT_ID=${contractId}`;
        }
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file updated automatically!');

    } catch (error) {
        console.error(`❌ Deployment failed: ${error.message}`);
        if (error.status) {
            console.error(`Status: ${error.status.toString()}`);
        }
        console.error(error);
        process.exit(1);
    }
}

deployContract();
