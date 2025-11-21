import { Shield } from 'lucide-react';

export const BlockchainSection = () => {
  return (
    <section id="blockchain" className="mb-12 scroll-mt-20">
      <div className="flex items-center mb-6">
        <Shield className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Blockchain/Hedera Integration</h2>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200 mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">⛓️ Smart Contract Architecture</h3>
        <p className="text-gray-700 mb-4">
          H.E.L.I.X. uses Hedera Smart Contract Service (HSCS) for immutable data storage and decentralized execution.
          The Procurement smart contract provides complete transparency and fraud detection on the Hedera network.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-lg mb-3 text-purple-900">📋 Procurement Contract</h4>
            <p className="text-sm text-gray-700 mb-3">Core government procurement management on blockchain</p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span><strong>Budget Management:</strong> Immutable budget allocation and tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span><strong>Project Lifecycle:</strong> End-to-end project tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span><strong>Vendor Management:</strong> Contractor registration and evaluation</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span><strong>Claim Processing:</strong> Payment claims with fraud detection</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span><strong>Public Transparency:</strong> Citizen-accessible APIs</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-lg mb-3 text-indigo-900">🚨 Fraud Detection</h4>
            <p className="text-sm text-gray-700 mb-3">AI-powered fraud detection integrated with blockchain</p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>ML Model Execution:</strong> Run fraud detection algorithms</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Risk Scoring:</strong> Generate immutable fraud scores (0-100)</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Alert Generation:</strong> Create tamper-proof fraud alerts</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Pattern Analysis:</strong> Track fraud patterns across time</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span><strong>Evidence Preservation:</strong> Store fraud evidence permanently</span>
              </li>
            </ul>
          </div>
        </div>

        <details className="mb-4">
          <summary className="cursor-pointer font-medium text-gray-900 hover:text-purple-600 p-4 bg-white rounded-lg border">
            View Contract Directory Structure →
          </summary>
          <div className="mt-3 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`contracts/
├── Procurement.sol              # Main procurement contract
│   ├── Budget Management        # Budget allocation functions
│   ├── Role Management          # RBAC implementation
│   ├── Allocation Tracking      # Budget allocation to deputies
│   ├── Claim Processing         # Vendor claim submission
│   └── System Statistics        # Transparency functions
├── deploy_contract.py           # Deployment script
└── hardhat.config.js            # Hardhat configuration`}</pre>
          </div>
        </details>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-lg border border-purple-300">
            <h4 className="font-semibold text-purple-900 mb-3">🎯 Blockchain Benefits</h4>
            <ul className="text-sm text-purple-800 space-y-2">
              <li>✓ <strong>Immutable Records:</strong> Cannot be altered or deleted</li>
              <li>✓ <strong>Decentralized Storage:</strong> Replicated across Hedera nodes</li>
              <li>✓ <strong>Tamper-proof Audit Trails:</strong> Complete transaction history</li>
              <li>✓ <strong>Public Verification:</strong> Anyone can audit the ledger</li>
              <li>✓ <strong>No Single Point of Failure:</strong> Consensus-based validation</li>
              <li>✓ <strong>Cryptographic Proof:</strong> Mathematically verifiable authenticity</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-4 rounded-lg border border-blue-300">
            <h4 className="font-semibold text-blue-900 mb-3">⚡ Performance Metrics</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Query Response:</span>
                <span className="font-bold text-blue-900">&lt; 100ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Transaction Finality:</span>
                <span className="font-bold text-blue-900">3-5 seconds</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Throughput:</span>
                <span className="font-bold text-blue-900">10,000+ tx/sec</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Uptime:</span>
                <span className="font-bold text-blue-900">99.99%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800">Cost:</span>
                <span className="font-bold text-blue-900">$0.0001/tx</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="smart-contracts" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Contract Implementation</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-lg mb-3">Solidity Smart Contract Example</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Procurement {
    address public mainGovernment;
    mapping(address => bool) public stateHeads;
    mapping(address => bool) public deputies;
    mapping(address => bool) public vendors;
    
    struct Budget {
        uint256 id;
        uint256 amount;
        string purpose;
        uint256 allocated;
        uint256 remaining;
        bool active;
        uint256 timestamp;
    }
    
    struct Claim {
        uint256 id;
        uint256 budgetId;
        uint256 allocationId;
        address vendor;
        uint256 amount;
        string description;
        string invoiceHash;
        bool approved;
        bool paid;
        uint256 fraudScore;
        bool flagged;
        uint256 timestamp;
    }
    
    // Budget allocation
    function createBudget(uint256 _amount, string memory _purpose) 
        external onlyMainGovernment {
        budgetCount++;
        budgets[budgetCount] = Budget({
            id: budgetCount,
            amount: _amount,
            purpose: _purpose,
            allocated: 0,
            remaining: _amount,
            active: true,
            timestamp: block.timestamp
        });
        
        emit BudgetCreated(budgetCount, _amount, _purpose);
    }
    
    // Submit vendor claim
    function submitClaim(
        uint256 _budgetId,
        uint256 _allocationId,
        uint256 _amount,
        string memory _description,
        string memory _invoiceHash
    ) external onlyVendor {
        claimCount++;
        claims[claimCount] = Claim({
            id: claimCount,
            budgetId: _budgetId,
            allocationId: _allocationId,
            vendor: msg.sender,
            amount: _amount,
            description: _description,
            invoiceHash: _invoiceHash,
            approved: false,
            paid: false,
            fraudScore: 0,
            flagged: false,
            timestamp: block.timestamp
        });
        
        emit ClaimSubmitted(claimCount, msg.sender, _amount);
    }
}`}</pre>
          </div>
        </div>
      </div>

      <div id="hedera-wallet" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Hedera Wallet Integration</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">Authentication Flow</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                <span>User clicks Login → Connect Hedera Wallet (HashPack/Blade)</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                <span>User approves connection in wallet extension</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                <span>Wallet returns Account ID (e.g., 0.0.123456)</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">4</span>
                <span>Frontend calls smart contract with Account ID</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">5</span>
                <span>Smart contract verifies Account ID and returns user data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-lg mb-3">Frontend Integration Code</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
            <pre>{`import { Client, ContractExecuteTransaction, ContractCallQuery } from '@hashgraph/sdk';

// Initialize Hedera client
const client = Client.forTestnet();
client.setOperator(accountId, privateKey);

// Execute contract transaction
const transaction = new ContractExecuteTransaction()
  .setContractId(contractId)
  .setGas(100000)
  .setFunction("createBudget", 
    new ContractFunctionParameters()
      .addUint256(1000000)
      .addString("School infrastructure")
  );

const txResponse = await transaction.execute(client);
const receipt = await txResponse.getReceipt(client);

// Query contract data
const query = new ContractCallQuery()
  .setContractId(contractId)
  .setGas(100000)
  .setFunction("getBudgets", new ContractFunctionParameters());

const result = await query.execute(client);
const budgets = parseBudgets(result);`}</pre>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-3">Deployment Commands</h4>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Deploy to Hedera Testnet:</p>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
              python backend/deploy_contract.py
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Verify Contract:</p>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
              hedera contract verify --contract-id 0.0.XXXXX
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
