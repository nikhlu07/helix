# 🚀 Deployment Scripts

## 🏆 Automated Deployment for H.E.L.I.X.

This directory contains **deployment automation scripts** for deploying H.E.L.I.X. to various environments including local, staging, and production.

## 📁 Files in This Directory

| File | Size | Purpose |
|------|------|---------|
| `deploy_local.ps1` | 1.0 KB | PowerShell script for local deployment on Windows |

## 📄 Script Descriptions

### `deploy_local.ps1` - Local Deployment Script
**PowerShell script for deploying H.E.L.I.X. locally on Windows**

**What it does:**
- Sets up local development environment
- Starts backend FastAPI server
- Starts frontend React development server
- Configures environment variables
- Opens browser to local demo

**Usage:**
```powershell
# Run from PowerShell
.\deploy_local.ps1

# Or with specific configuration
.\deploy_local.ps1 -Environment "demo" -Port 8000
```

**Requirements:**
- PowerShell 5.1 or higher
- Python 3.9+ installed
- Node.js 18+ installed
- Ollama running (for AI fraud detection)

**What gets deployed:**
- Backend API on `http://localhost:8000`
- Frontend app on `http://localhost:5173`
- Fraud detection engine on `http://localhost:8080`

## 🎯 Hackathon Quick Deploy

### For Judges/Reviewers
```powershell
# Fastest way to see H.E.L.I.X. in action
cd scripts\deploy
.\deploy_local.ps1

# Wait 30 seconds for services to start
# Browser will open automatically to http://localhost:5173
```

### For Developers
```powershell
# Deploy with debug logging
.\deploy_local.ps1 -Debug

# Deploy specific components
.\deploy_local.ps1 -Components "backend,frontend"

# Deploy with custom ports
.\deploy_local.ps1 -BackendPort 8000 -FrontendPort 3000
```

## 🔧 Deployment Process

The local deployment script performs these steps:

1. **Environment Check**: Verifies Python, Node.js, and Ollama are installed
2. **Dependency Installation**: Installs backend and frontend dependencies
3. **Database Setup**: Initializes local SQLite database with demo data
4. **Service Startup**: Starts backend, frontend, and fraud engine
5. **Health Checks**: Verifies all services are running correctly
6. **Browser Launch**: Opens demo in default browser

## 📊 Deployment Statistics

| Metric | Value |
|--------|-------|
| **Total Scripts** | 1 PowerShell script |
| **Deployment Time** | ~2-3 minutes (first run) |
| **Deployment Time** | ~30 seconds (subsequent runs) |
| **Services Deployed** | 3 (backend, frontend, fraud engine) |
| **Automation Level** | Fully automated |

## 🎯 Hackathon Highlights

### One-Command Deployment
- **✅ Single Script**: Deploy entire stack with one command
- **✅ Automatic Setup**: Handles all dependencies and configuration
- **✅ Error Recovery**: Intelligent error handling and retry logic
- **✅ Health Checks**: Verifies deployment success

### Developer Experience
- **✅ Fast Iteration**: Quick redeployment for testing changes
- **✅ Clean Shutdown**: Graceful service termination
- **✅ Log Aggregation**: Centralized logging for all services
- **✅ Port Flexibility**: Configurable ports for multi-instance testing

## 🔗 Related Scripts

- **Setup Scripts**: [../setup/README.md](../setup/README.md) - Initial environment setup
- **Backend Deployment**: [../../backend/README.md](../../backend/README.md) - Backend-specific deployment
- **Frontend Deployment**: [../../frontend/README.md](../../frontend/README.md) - Frontend-specific deployment

## 📝 License

MIT License - see [LICENSE](../../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** Deployment Automation
