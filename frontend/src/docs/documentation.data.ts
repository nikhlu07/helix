import { FileText, Code, Server, Shield, Cpu, Wrench, Rocket, AlertCircle } from 'lucide-react';

export const sections = [
    { id: 'overview', title: 'Overview', icon: FileText, subsections: [] },
    { id: 'architecture', title: 'Architecture', icon: Code, subsections: [] },
    { id: 'backend', title: 'Backend', icon: Server, subsections: ['backend-structure', 'backend-auth', 'backend-hedera', 'backend-fraud', 'backend-api'] },
    { id: 'frontend', title: 'Frontend', icon: Code, subsections: ['frontend-structure', 'frontend-auth', 'frontend-components', 'frontend-hooks', 'frontend-services'] },
    { id: 'blockchain', title: 'Blockchain/Hedera', icon: Shield, subsections: [] },
    { id: 'ai-ml', title: 'AI/ML', icon: Cpu, subsections: [] },
    { id: 'deployment', title: 'Deployment', icon: Rocket, subsections: [] },
    { id: 'api', title: 'API Reference', icon: FileText, subsections: [] },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: AlertCircle, subsections: [] },
];
