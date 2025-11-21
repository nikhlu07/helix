# 📚 H.E.L.I.X. Documentation

## 🏆 Hackathon Documentation Hub

This directory contains **technical documentation, integration guides, and architecture diagrams** for the H.E.L.I.X. project. Essential reading for understanding the system's design and implementation.

## 📁 Files in This Directory

| File | Size | Purpose |
|------|------|---------|
| `CKUSDC_INTEGRATION_GUIDE.md` | 11.8 KB | Legacy guide for ckUSDC integration (historical reference) |
| `CKUSDC_TRANSACTION_FLOW.md` | 13.2 KB | Legacy transaction flow documentation (historical reference) |
| `architecture-overview.svg` | 7.5 KB | System architecture diagram showing all components |
| `fraud-detection-flow.svg` | 9.3 KB | Fraud detection workflow visualization |

## 📄 Document Descriptions

### Architecture Overview (`architecture-overview.svg`)
**Visual diagram of the complete H.E.L.I.X. system architecture**

Shows the interaction between:
- **Frontend**: React application with role-based dashboards
- **Backend**: FastAPI server with fraud detection integration
- **AI Engines**: Both production and autonomous fraud detection systems
- **Hedera Integration**: Smart contracts, consensus service, and DID authentication
- **Database**: PostgreSQL for application data
- **Blockchain**: Hedera Hashgraph for immutable records

**Use this diagram to:**
- Understand the overall system design
- See how components communicate
- Explain the architecture to judges/stakeholders
- Plan integration points for new features

### Fraud Detection Flow (`fraud-detection-flow.svg`)
**Detailed workflow of the fraud detection process**

Illustrates:
1. **Transaction Submission**: Vendor submits a procurement claim
2. **Rules Engine Analysis**: 10 fraud detection rules evaluate the claim
3. **LLM Analysis**: `gemma3:4b` performs contextual analysis with RAG
4. **Score Calculation**: Combined fraud score from rules + LLM
5. **Alert Generation**: High-risk claims trigger immediate alerts
6. **Investigation**: Automated investigation for suspicious cases
7. **Blockchain Recording**: All results stored immutably on Hedera

**Use this diagram to:**
- Explain the fraud detection innovation
- Show the hybrid AI approach (rules + LLM)
- Demonstrate real-time processing
- Highlight blockchain integration

### Legacy Documentation (Historical Reference)

#### `CKUSDC_INTEGRATION_GUIDE.md`
Original integration guide for ckUSDC (Chain-Key USDC) on Internet Computer Protocol (ICP). This was the initial blockchain integration before migrating to Hedera.

**Historical Context:**
- H.E.L.I.X. was originally built on ICP
- Used ckUSDC for stablecoin payments
- Migrated to Hedera for better enterprise features

**Why we migrated to Hedera:**
- ✅ Better enterprise adoption and support
- ✅ HBAR Foundation backing for social impact projects
- ✅ Faster consensus (3-5 seconds vs ICP's finality time)
- ✅ Lower transaction costs
- ✅ Stronger DID/identity features

#### `CKUSDC_TRANSACTION_FLOW.md`
Detailed transaction flow documentation for the original ICP implementation.

**Kept for:**
- Historical reference
- Understanding the evolution of H.E.L.I.X.
- Potential future multi-chain support

## 🎯 Hackathon Highlights

### Documentation Quality
- **✅ Visual Diagrams**: Professional SVG diagrams for architecture and workflows
- **✅ Comprehensive Guides**: Detailed integration and flow documentation
- **✅ Historical Context**: Preserved migration history showing project evolution
- **✅ Multi-Format**: Both visual and written documentation

### Technical Communication
- **✅ Clear Architecture**: Easy-to-understand system design
- **✅ Workflow Visualization**: Step-by-step fraud detection process
- **✅ Integration Patterns**: Reusable patterns for blockchain integration
- **✅ Migration Story**: Demonstrates adaptability and technical decision-making

## 🚀 Using These Documents

### For Judges
1. **Start with**: `architecture-overview.svg` - Get the big picture
2. **Then review**: `fraud-detection-flow.svg` - Understand the core innovation
3. **Optional**: Legacy docs - See the project's evolution

### For Developers
1. **Architecture**: Use `architecture-overview.svg` to understand component relationships
2. **Fraud Detection**: Reference `fraud-detection-flow.svg` when working on AI features
3. **Integration**: Learn from legacy docs how to integrate blockchain services

### For Stakeholders
1. **System Design**: `architecture-overview.svg` shows the complete solution
2. **Fraud Prevention**: `fraud-detection-flow.svg` demonstrates the security approach
3. **Evolution**: Legacy docs show continuous improvement and adaptability

## 📊 Documentation Statistics

| Metric | Value |
|--------|-------|
| **Total Documents** | 4 files |
| **Visual Diagrams** | 2 SVG files |
| **Written Guides** | 2 markdown files |
| **Total Size** | ~42 KB |
| **Coverage** | Architecture, workflows, integration, legacy |

## 🔗 Related Documentation

- **Main README**: [../README.md](../README.md) - Project overview
- **Backend README**: [../backend/README.md](../backend/README.md) - API documentation
- **Frontend README**: [../frontend/README.md](../frontend/README.md) - UI documentation
- **AI README**: [../AI/README.md](../AI/README.md) - Fraud detection engines
- **Contracts README**: [../contracts/README.md](../contracts/README.md) - Smart contracts

## 📝 License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Built for Hedera Hackathon 2025** | **Category:** Technical Documentation Excellence
