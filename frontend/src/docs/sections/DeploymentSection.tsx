import { Rocket } from 'lucide-react';

export const DeploymentSection = () => {
  return (
    <section id="deployment" className="mb-12 scroll-mt-20">
      <div className="flex items-center mb-6">
        <Rocket className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Deployment Guide</h2>
      </div>

      <div id="local-setup" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Local Development Setup</h3>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
          <h4 className="font-semibold text-lg mb-3">Prerequisites</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold text-blue-900 mb-2">Required Software</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Node.js 18+</li>
                <li>• Python 3.9+</li>
                <li>• Hedera SDK</li>
                <li>• Ollama</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="font-semibold text-green-900 mb-2">System Requirements</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• CPU: 4+ cores</li>
                <li>• RAM: 8GB min</li>
                <li>• Storage: 20GB+</li>
                <li>• Network: Stable</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-semibold text-purple-900 mb-2">Optional</p>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• PostgreSQL 15+</li>
                <li>• Redis 7+</li>
                <li>• Docker</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-semibold text-lg mb-3">Step 1: Clone Repository</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{`git clone https://github.com/nikhlu07/H.E.L.I.X.git
cd H.E.L.I.X`}</pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-semibold text-lg mb-3">Step 2: Setup Ollama & AI Models</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{`# Install Ollama from https://ollama.ai/
ollama pull gemma3:4b
ollama pull nomic-embed-text
ollama list  # Verify installation`}</pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-semibold text-lg mb-3">Step 3: Setup Backend</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{`cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run backend
python hierarchical_demo_api.py
# Backend runs on http://localhost:8000`}</pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-semibold text-lg mb-3">Step 4: Setup Frontend</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{`cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your configuration

# Run frontend
npm run dev
# Frontend runs on http://localhost:5173`}</pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-semibold text-lg mb-3">Step 5: Setup Fraud Detection Engine</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{`cd AI/fraud_engine
pip install -r requirements.txt

# Start fraud engine
./start_fraud_engine.sh
# Fraud engine runs on http://localhost:8080`}</pre>
            </div>
          </div>
        </div>
      </div>

      <div id="docker" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Docker Deployment</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-lg mb-3">Production Docker Setup</h4>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`# Create .env file with production values
cp .env.production.example .env

# Set required environment variables
export POSTGRES_PASSWORD=your_secure_password
export REDIS_PASSWORD=your_secure_password
export SECRET_KEY=your_secret_key

# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f`}</pre>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Services Included:</strong> Frontend (Nginx), Backend (FastAPI), PostgreSQL, Redis, Load Balancer
            </p>
          </div>
        </div>
      </div>

      <div id="hedera-deployment" className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Hedera Testnet/Mainnet Deployment</h3>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-semibold text-lg mb-3">Step 1: Setup Hedera Account</h4>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                • Create Hedera account at <a href="https://portal.hedera.com" className="underline font-semibold">https://portal.hedera.com</a><br />
                • Fund account with HBAR for gas fees<br />
                • Save your Account ID (0.0.X) and Private Key<br />
                • Minimum: 100 HBAR recommended for testnet
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-semibold text-lg mb-3">Step 2: Deploy Smart Contract</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{`# Install Hedera SDK
pip install hedera-sdk-py

# Set environment variables
export HEDERA_ACCOUNT_ID="0.0.YOUR_ACCOUNT"
export HEDERA_PRIVATE_KEY="your_private_key"
export HEDERA_NETWORK="testnet"  # or "mainnet"

# Deploy contract
cd contracts
python deploy_contract.py

# Save the contract ID and topic ID from output`}</pre>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h4 className="font-semibold text-lg mb-3">Step 3: Configure Backend</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{`# Update backend/.env
HEDERA_ACCOUNT_ID=0.0.YOUR_ACCOUNT
HEDERA_PRIVATE_KEY=your_private_key
HEDERA_NETWORK=testnet
HEDERA_CONTRACT_ID=0.0.CONTRACT_ID
HEDERA_AUDIT_TOPIC_ID=0.0.TOPIC_ID

# Deploy backend to production
# (Use your preferred hosting: AWS, GCP, Azure, etc.)`}</pre>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-3">🎉 Access Your Application</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-900 mb-1">Frontend</p>
            <p className="text-sm text-gray-600">http://localhost:5173</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-900 mb-1">Backend API</p>
            <p className="text-sm text-gray-600">http://localhost:8000</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-900 mb-1">API Docs</p>
            <p className="text-sm text-gray-600">http://localhost:8000/docs</p>
          </div>
        </div>
      </div>
    </section>
  );
};
