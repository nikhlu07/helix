# 🚀 H.E.L.I.X. Deployment & Setup Scripts

## 🏆 Hackathon Infrastructure Automation

This directory contains **deployment and setup scripts** for automating H.E.L.I.X. infrastructure. These scripts enable quick deployment for hackathon demos and production environments.

## 📁 Directory Structure

```
scripts/
├── deploy/          # Deployment automation scripts
└── setup/           # Initial setup and configuration scripts
```

## 📂 Subdirectories

### `deploy/` - Deployment Scripts
Contains scripts for deploying H.E.L.I.X. to various environments:
- Production deployment automation
- Hedera contract deployment
- Docker container orchestration
- Cloud platform deployment (Vercel, AWS, etc.)

**See [deploy/README.md](deploy/README.md) for detailed documentation.**

### `setup/` - Setup Scripts
Contains scripts for initial system setup and configuration:
- Development environment setup
- Database initialization
- Dependency installation
- Configuration file generation

**See [setup/README.md](setup/README.md) for detailed documentation.**

## 🎯 Hackathon Use Cases

### Quick Demo Setup
```bash
# Run setup script to configure demo environment
cd scripts/setup
./setup_demo.sh

# Deploy to local environment
cd ../deploy
./deploy_local.sh
```

### Production Deployment
```bash
# Deploy to Hedera mainnet
cd scripts/deploy
./deploy_hedera_mainnet.sh

# Deploy frontend to Vercel
./deploy_vercel.sh

# Deploy backend to cloud
./deploy_backend.sh
```

## 🚀 Quick Start

### For Judges/Reviewers
```bash
# Fastest way to get H.E.L.I.X. running
cd scripts/setup
./quick_start.sh

# This will:
# 1. Install all dependencies
# 2. Set up demo database
# 3. Start backend and frontend
# 4. Open browser to demo
```

### For Developers
```bash
# Full development setup
cd scripts/setup
./dev_setup.sh

# This will:
# 1. Create virtual environments
# 2. Install all dependencies
# 3. Set up pre-commit hooks
# 4. Initialize databases
# 5. Generate sample data
```

## 📊 Script Statistics

| Metric | Value |
|--------|-------|
| **Total Subdirectories** | 2 |
| **Deployment Scripts** | Multiple automation scripts |
| **Setup Scripts** | Environment configuration tools |
| **Automation Level** | One-command deployment |

## 🎯 Hackathon Highlights

### Infrastructure as Code
- **✅ Automated Deployment**: One-command deployment to multiple platforms
- **✅ Reproducible Builds**: Consistent environments across machines
- **✅ Quick Demo Setup**: Judges can run the system in minutes
- **✅ Production Ready**: Scripts tested for production deployment

### Developer Experience
- **✅ Fast Onboarding**: New developers can start in < 5 minutes
- **✅ Environment Parity**: Dev, staging, and production use same scripts
- **✅ Error Handling**: Scripts include comprehensive error checking
- **✅ Documentation**: Each script is well-documented with usage examples

## 🔗 Related Documentation

- **Main README**: [../README.md](../README.md) - Project overview
- **Backend README**: [../backend/README.md](../backend/README.md) - Backend setup
- **Frontend README**: [../frontend/README.md](../frontend/README.md) - Frontend setup
- **Deployment Guide**: [../DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) - Full deployment documentation

## 📝 License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** Infrastructure Automation
