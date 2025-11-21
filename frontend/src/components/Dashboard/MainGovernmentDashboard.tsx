import { useState, useRef, useEffect } from 'react';
import { DollarSign, Users, Shield, AlertTriangle, TrendingUp, Building, Eye, Mail, Star, BarChart2, FileText } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useContract } from '../../hooks/useContracts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Vendor, Claim } from '../../types';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export function MainGovernmentDashboard() {
    const [budgetAmount, setBudgetAmount] = useState('');
    const [budgetPurpose, setBudgetPurpose] = useState('');
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
    const [isEmergencyPaused, setIsEmergencyPaused] = useState(false);
    const [isPauseConfirmationOpen, setIsPauseConfirmationOpen] = useState(false);
    const [isDisableConfirmationOpen, setIsDisableConfirmationOpen] = useState(false);
    const [isLockingBudget, setIsLockingBudget] = useState(false);

    // State Head Management
    const [newStateHeadPrincipal, setNewStateHeadPrincipal] = useState('');
    const [isProposingStateHead, setIsProposingStateHead] = useState(false);
    const [pendingStateHeads] = useState<any[]>([]);

    // Budget Planning
    const [budgetPlan, setBudgetPlan] = useState<any[]>([]);
    const [newAllocation, setNewAllocation] = useState({
        state: '',
        amount: '',
        purpose: '',
        deputy: '',
        criteria: '',
        priority: 'medium'
    });
    const [isPlanningMode, setIsPlanningMode] = useState(false);
    const [allocationMethod, setAllocationMethod] = useState('manual'); // manual, population, gdp, equal

    // Real data from contract
    const [budgets, setBudgets] = useState<any[]>([]);
    const [claims, setClaims] = useState<any[]>([]);
    const [vendors] = useState<any[]>([
        { id: "vendor-001", name: "MedTech Solutions", businessType: "Medical Equipment", status: "approved" },
        { id: "vendor-002", name: "EduFurniture Co.", businessType: "Educational Supplies", status: "pending" },
        { id: "vendor-003", name: "RoadBuild Ltd.", businessType: "Construction", status: "approved" },
        { id: "vendor-004", name: "GreenEnergy Corp", businessType: "Renewable Energy", status: "approved" }
    ]);
    const [systemStats, setSystemStats] = useState<any>(null);
    const { showToast } = useToast();
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Use the new contract hook
    const {
        getSystemStats,
        getAllBudgets,
        getAllClaims,
        lockBudget,
        allocateBudget,
        proposeStateHead,
        confirmStateHead
    } = useContract();

    // Load real data
    useEffect(() => {
        const loadData = async () => {
            try {
                // Force clear all data first
                setBudgets([]);
                setClaims([]);
                setSystemStats(null);

                // Small delay to ensure state is cleared
                await new Promise(resolve => setTimeout(resolve, 100));

                // Load system stats
                const stats = await getSystemStats();
                if (stats) setSystemStats(stats);

                // Load budgets
                const budgetData = await getAllBudgets();
                if (budgetData) setBudgets(budgetData);

                // Load claims
                const claimsData = await getAllClaims();
                if (claimsData && claimsData.length > 0) setClaims(claimsData);

            } catch (error) {
                console.log('Data loading failed:', error);
            }
        };

        loadData();
    }, [getSystemStats, getAllBudgets, getAllClaims]);

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.2,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };

    const handleLockBudget = async () => {
        if (!budgetAmount || !budgetPurpose) {
            showToast('Please fill in all budget details', 'warning');
            return;
        }

        setIsLockingBudget(true);

        try {
            const amount = parseInt(budgetAmount);
            console.log('Attempting to lock budget:', { amount, purpose: budgetPurpose });

            const result = await lockBudget(amount, budgetPurpose);

            if (result) {
                showToast(`Budget of $${budgetAmount} locked for ${budgetPurpose}`, 'success');
                setBudgetAmount('');
                setBudgetPurpose('');

                // Reload data immediately after successful lock
                try {
                    const freshBudgetData = await getAllBudgets();
                    if (freshBudgetData) setBudgets(freshBudgetData);

                    const stats = await getSystemStats();
                    if (stats) setSystemStats(stats);

                } catch (error) {
                    console.error('Failed to reload data:', error);
                }
            } else {
                showToast('Failed to lock budget', 'error');
            }
        } catch (error) {
            console.error('Error locking budget:', error);
            showToast('Failed to lock budget', 'error');
        } finally {
            setIsLockingBudget(false);
        }
    };

    const handleProposeStateHead = async () => {
        if (!newStateHeadPrincipal.trim()) {
            showToast('Please enter a valid Principal ID', 'warning');
            return;
        }

        setIsProposingStateHead(true);
        try {
            await proposeStateHead(newStateHeadPrincipal.trim());
            showToast('State Head proposed successfully!', 'success');
            setNewStateHeadPrincipal('');
        } catch (error) {
            console.error('Error proposing state head:', error);
            showToast(`Failed to propose state head: ${error}`, 'error');
        } finally {
            setIsProposingStateHead(false);
        }
    };

    const handleConfirmStateHead = async (stateHeadPrincipal: string) => {
        try {
            await confirmStateHead(stateHeadPrincipal);
            showToast('State Head confirmed successfully!', 'success');
        } catch (error) {
            console.error('Error confirming state head:', error);
            showToast(`Failed to confirm state head: ${error}`, 'error');
        }
    };

    const handleAddAllocation = () => {
        if (!newAllocation.state || !newAllocation.amount || !newAllocation.purpose) {
            showToast('Please fill in all allocation details', 'warning');
            return;
        }

        const allocation = {
            id: Date.now(),
            state: newAllocation.state,
            amount: parseInt(newAllocation.amount),
            purpose: newAllocation.purpose,
            deputy: newAllocation.deputy || 'TBD',
            criteria: newAllocation.criteria,
            priority: newAllocation.priority
        };

        setBudgetPlan([...budgetPlan, allocation]);
        setNewAllocation({ state: '', amount: '', purpose: '', deputy: '', criteria: '', priority: 'medium' });
        showToast('Allocation added to plan', 'success');
    };

    const handleAutoAllocate = () => {
        const totalBudget = parseInt(budgetAmount) || 0;
        if (totalBudget === 0) {
            showToast('Please enter total budget amount first', 'warning');
            return;
        }

        const stateData = {
            'Maharashtra': { population: 112374333, gdp: 400000, priority: 'high' },
            'Karnataka': { population: 61130704, gdp: 250000, priority: 'high' },
            'Tamil Nadu': { population: 72147030, gdp: 300000, priority: 'high' },
            'Gujarat': { population: 60439692, gdp: 200000, priority: 'medium' },
            'Rajasthan': { population: 68548437, gdp: 150000, priority: 'medium' }
        };

        let allocations = [];

        if (allocationMethod === 'population') {
            const totalPopulation = Object.values(stateData).reduce((sum, state) => sum + state.population, 0);
            allocations = Object.entries(stateData).map(([state, data]) => ({
                id: Date.now() + Math.random(),
                state,
                amount: Math.round((data.population / totalPopulation) * totalBudget),
                purpose: 'Population-based allocation',
                deputy: 'TBD',
                criteria: `Population: ${data.population.toLocaleString()}`,
                priority: data.priority
            }));
        } else if (allocationMethod === 'gdp') {
            const totalGDP = Object.values(stateData).reduce((sum, state) => sum + state.gdp, 0);
            allocations = Object.entries(stateData).map(([state, data]) => ({
                id: Date.now() + Math.random(),
                state,
                amount: Math.round((data.gdp / totalGDP) * totalBudget),
                purpose: 'GDP-based allocation',
                deputy: 'TBD',
                criteria: `GDP: $${data.gdp.toLocaleString()}`,
                priority: data.priority
            }));
        } else if (allocationMethod === 'equal') {
            const states = Object.keys(stateData);
            const amountPerState = Math.round(totalBudget / states.length);
            allocations = states.map((state, index) => ({
                id: Date.now() + Math.random(),
                state,
                amount: index === states.length - 1 ? totalBudget - (amountPerState * (states.length - 1)) : amountPerState,
                purpose: 'Equal distribution',
                deputy: 'TBD',
                criteria: 'Equal share',
                priority: stateData[state].priority
            }));
        }

        setBudgetPlan(allocations);
        showToast(`Auto-allocated budget using ${allocationMethod} method`, 'success');
    };

    const handleRemoveAllocation = (id: number) => {
        setBudgetPlan(budgetPlan.filter(item => item.id !== id));
        showToast('Allocation removed from plan', 'info');
    };

    const handleExecutePlan = async () => {
        if (budgetPlan.length === 0) {
            showToast('No allocations in plan', 'warning');
            return;
        }

        const totalAmount = budgetPlan.reduce((sum, item) => sum + item.amount, 0);
        const totalPurpose = `Multi-state allocation: ${budgetPlan.map(item => `${item.state} ($${(item.amount || 0).toLocaleString()})`).join(', ')}`;

        try {
            // Lock the total budget first
            const budgetResult = await lockBudget(totalAmount, totalPurpose);
            // Assuming lockBudget returns the budget object or ID. If it returns object, get ID.
            const budgetId = typeof budgetResult === 'object' ? budgetResult.id : budgetResult;

            showToast(`Budget locked! Now allocating to states...`, 'success');

            for (const allocation of budgetPlan) {
                try {
                    const deputyPrincipal = "rdmg5-vaaaa-aaaah-qcaiq-cai"; // Placeholder

                    await allocateBudget(
                        Number(budgetId),
                        allocation.amount,
                        allocation.purpose,
                        deputyPrincipal
                    );

                    showToast(`Allocated $${(allocation.amount || 0).toLocaleString()} to ${allocation.state}`, 'success');
                } catch (allocationError) {
                    console.error(`Error allocating to ${allocation.state}:`, allocationError);
                    showToast(`Failed to allocate to ${allocation.state}: ${allocationError}`, 'error');
                }
            }

            setBudgetPlan([]);
            setIsPlanningMode(false);

            const freshBudgetData = await getAllBudgets();
            if (freshBudgetData) setBudgets(freshBudgetData);

        } catch (error) {
            console.error('Error executing plan:', error);
            showToast(`Failed to execute plan: ${error}`, 'error');
        }
    };

    const handleEmergencyPause = () => {
        setIsPauseConfirmationOpen(true);
    };

    const confirmEmergencyPause = () => {
        setIsEmergencyPaused(true);
        setIsPauseConfirmationOpen(false);
        showToast('Emergency pause activated - All payments suspended', 'warning');
    };

    const handleDisableEmergencyPause = () => {
        setIsDisableConfirmationOpen(true);
    };

    const confirmDisableEmergencyPause = () => {
        setIsEmergencyPaused(false);
        setIsDisableConfirmationOpen(false);
        showToast('Emergency pause disabled - System back to normal', 'success');
    };

    const handleApproveVendor = () => {
        showToast('Vendor approved and added to registry', 'success');
    };

    const totalBudget = budgets.reduce((sum, budget) => sum + (budget.amount || 0), 0);
    const allocatedBudget = budgets.reduce((sum, budget) => sum + (budget.amount || 0), 0); // For now, same as total
    const criticalClaims = claims.filter(claim => claim.riskLevel === 'critical').length;
    const pendingVendors = vendors.filter(vendor => vendor.status === 'pending').length;

    const stats = {
        totalBudget: `$${(totalBudget / 1000000).toFixed(1)}M`,
        allocatedBudget: `$${(allocatedBudget / 1000000).toFixed(1)}M`,
        criticalAlerts: criticalClaims,
        pendingVendors: pendingVendors,
    };

    return (
        <>
            <section
                className="py-16 px-4 bg-white w-full relative min-h-screen flex items-start"
                ref={dashboardRef}
            >
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
                <main className="max-w-7xl mx-auto w-full z-10">
                    {/* Header */}
                    <article className="text-center mb-12">
                        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                            <VerticalCutReveal
                                splitBy="words"
                                staggerDuration={0.15}
                                staggerFrom="first"
                                reverse={true}
                                containerClassName="justify-center"
                                transition={{
                                    type: "spring",
                                    stiffness: 250,
                                    damping: 40,
                                    delay: 0,
                                }}
                            >
                                Government Dashboard
                            </VerticalCutReveal>
                        </h1>
                        <TimelineContent
                            as="p"
                            animationNum={0}
                            timelineRef={dashboardRef as React.RefObject<HTMLElement>}
                            customVariants={revealVariants}
                            className="text-gray-600 text-lg"
                        >
                            Oversee budgets, vendors, and claims with precision and transparency.
                        </TimelineContent>
                    </article>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Key Metrics */}
                            <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Key Metrics</CardTitle>
                                        <CardDescription>Real-time overview of the ecosystem.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                            <DollarSign className="h-6 w-6 text-gray-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Total Budget</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalBudget}</p>
                                        </div>
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                            <TrendingUp className="h-6 w-6 text-gray-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Allocated Budget</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.allocatedBudget}</p>
                                        </div>
                                        <div className="flex flex-col p-4 bg-red-50 rounded-lg">
                                            <AlertTriangle className="h-6 w-6 text-red-500 mb-2" />
                                            <p className="text-sm font-medium text-red-600">Critical Alerts</p>
                                            <p className="text-2xl font-bold text-red-600">{stats.criticalAlerts}</p>
                                        </div>
                                        <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                            <Users className="h-6 w-6 text-gray-500 mb-2" />
                                            <p className="text-sm font-medium text-gray-600">Pending Vendors</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.pendingVendors}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TimelineContent>

                            {/* Budget Planning */}
                            <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <CardTitle className="text-xl font-bold">Budget Planning</CardTitle>
                                                <CardDescription>Plan and specify budget allocations before locking.</CardDescription>
                                            </div>
                                            <Button
                                                onClick={() => setIsPlanningMode(!isPlanningMode)}
                                                variant={isPlanningMode ? "destructive" : "default"}
                                                className="px-4 py-2"
                                            >
                                                {isPlanningMode ? 'Cancel Planning' : 'Start Planning'}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {isPlanningMode ? (
                                            <div className="space-y-6">
                                                {/* Allocation Method Selection */}
                                                <div className="p-4 bg-blue-50 rounded-lg">
                                                    <h4 className="font-semibold text-gray-700 mb-3">Allocation Method</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        <Button
                                                            onClick={() => setAllocationMethod('manual')}
                                                            variant={allocationMethod === 'manual' ? 'default' : 'outline'}
                                                            className="text-sm"
                                                        >
                                                            Manual
                                                        </Button>
                                                        <Button
                                                            onClick={() => setAllocationMethod('population')}
                                                            variant={allocationMethod === 'population' ? 'default' : 'outline'}
                                                            className="text-sm"
                                                        >
                                                            By Population
                                                        </Button>
                                                        <Button
                                                            onClick={() => setAllocationMethod('gdp')}
                                                            variant={allocationMethod === 'gdp' ? 'default' : 'outline'}
                                                            className="text-sm"
                                                        >
                                                            By GDP
                                                        </Button>
                                                        <Button
                                                            onClick={() => setAllocationMethod('equal')}
                                                            variant={allocationMethod === 'equal' ? 'default' : 'outline'}
                                                            className="text-sm"
                                                        >
                                                            Equal Share
                                                        </Button>
                                                    </div>
                                                    {allocationMethod !== 'manual' && (
                                                        <div className="mt-3">
                                                            <Button
                                                                onClick={handleAutoAllocate}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                            >
                                                                Auto-Allocate Based on {allocationMethod}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Add Allocation Form */}
                                                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">State</label>
                                                        <select
                                                            value={newAllocation.state}
                                                            onChange={(e) => setNewAllocation({ ...newAllocation, state: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        >
                                                            <option value="">Select State</option>
                                                            <option value="Maharashtra">Maharashtra</option>
                                                            <option value="Karnataka">Karnataka</option>
                                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                                            <option value="Gujarat">Gujarat</option>
                                                            <option value="Rajasthan">Rajasthan</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">Amount ($)</label>
                                                        <input
                                                            type="number"
                                                            value={newAllocation.amount}
                                                            onChange={(e) => setNewAllocation({ ...newAllocation, amount: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                            placeholder="e.g., 500000"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">Purpose</label>
                                                        <input
                                                            type="text"
                                                            value={newAllocation.purpose}
                                                            onChange={(e) => setNewAllocation({ ...newAllocation, purpose: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                            placeholder="e.g., Infrastructure"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">Deputy Principal</label>
                                                        <input
                                                            type="text"
                                                            value={newAllocation.deputy}
                                                            onChange={(e) => setNewAllocation({ ...newAllocation, deputy: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                            placeholder="Deputy Principal ID"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">Criteria</label>
                                                        <input
                                                            type="text"
                                                            value={newAllocation.criteria}
                                                            onChange={(e) => setNewAllocation({ ...newAllocation, criteria: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                            placeholder="e.g., Population, GDP, Priority"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700">Priority</label>
                                                        <select
                                                            value={newAllocation.priority}
                                                            onChange={(e) => setNewAllocation({ ...newAllocation, priority: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        >
                                                            <option value="high">High Priority</option>
                                                            <option value="medium">Medium Priority</option>
                                                            <option value="low">Low Priority</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-end">
                                                        <Button
                                                            onClick={handleAddAllocation}
                                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            Add to Plan
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Budget Plan Summary */}
                                                {budgetPlan.length > 0 && (
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold text-gray-700">Budget Plan Summary</h4>
                                                        <div className="space-y-2">
                                                            {budgetPlan.map((allocation) => (
                                                                <div key={allocation.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                                                    <div className="flex-1">
                                                                        <div className="font-medium">{allocation.state}</div>
                                                                        <div className="text-sm text-gray-600">{allocation.purpose}</div>
                                                                        <div className="text-xs text-blue-600">{allocation.criteria}</div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="font-semibold">${(allocation.amount || 0).toLocaleString()}</div>
                                                                        <div className="text-sm text-gray-500">{allocation.deputy}</div>
                                                                        <div className="text-xs">
                                                                            <span className={`px-2 py-1 rounded text-xs ${allocation.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                                                    allocation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                                        'bg-green-100 text-green-800'
                                                                                }`}>
                                                                                {allocation.priority.toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        onClick={() => handleRemoveAllocation(allocation.id)}
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="ml-2 text-red-600 hover:text-red-700"
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                                            <div>
                                                                <div className="font-semibold">Total Budget: ${budgetPlan.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</div>
                                                                <div className="text-sm text-gray-600">{budgetPlan.length} allocations</div>
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Money will go directly to deputies, not state government
                                                                </div>
                                                            </div>
                                                            <Button
                                                                onClick={handleExecutePlan}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                                                            >
                                                                Execute Plan
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                                <p>Click "Start Planning" to create a detailed budget allocation plan</p>
                                                <p className="text-sm">Plan which states get what amounts and for what purposes</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TimelineContent>

                            {/* Quick Budget Lock (Legacy) */}
                            <TimelineContent as="div" animationNum={2.1} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Quick Budget Lock</CardTitle>
                                        <CardDescription>Lock budget without detailed planning (legacy method).</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Amount ($)</label>
                                            <input
                                                type="number"
                                                value={budgetAmount}
                                                onChange={(e) => setBudgetAmount(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                placeholder="e.g., 1000000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Purpose</label>
                                            <input
                                                type="text"
                                                value={budgetPurpose}
                                                onChange={(e) => setBudgetPurpose(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                placeholder="e.g., Infrastructure Development"
                                            />
                                        </div>
                                        <Button
                                            onClick={handleLockBudget}
                                            disabled={isLockingBudget}
                                            className="w-full bg-black hover:bg-gray-800 text-white"
                                        >
                                            {isLockingBudget ? 'Locking...' : 'Lock Budget'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TimelineContent>

                            {/* Claims Review */}
                            <TimelineContent as="div" animationNum={3} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Claims Review</CardTitle>
                                        <CardDescription>Review and approve vendor claims.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Claim ID</TableHead>
                                                    <TableHead>Vendor</TableHead>
                                                    <TableHead>Amount</TableHead>
                                                    <TableHead>Risk</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {claims.map((claim) => (
                                                    <TableRow key={claim.id} className="hover:bg-gray-50/50">
                                                        <TableCell className="font-mono text-xs">#{claim.id}</TableCell>
                                                        <TableCell>{claim.vendor}</TableCell>
                                                        <TableCell className="font-medium">${(claim.amount || 0).toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={claim.riskLevel === 'critical' ? 'destructive' : 'outline'} className={
                                                                claim.riskLevel === 'critical' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                                                    claim.riskLevel === 'high' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                                                                        'bg-green-100 text-green-800 hover:bg-green-200'
                                                            }>
                                                                {claim.riskLevel}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">{claim.status}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" onClick={() => setSelectedClaim(claim)}>
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TimelineContent>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Emergency Controls */}
                            <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-red-50 border-red-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold text-red-800 flex items-center">
                                            <AlertTriangle className="mr-2 h-5 w-5" />
                                            Emergency Controls
                                        </CardTitle>
                                        <CardDescription className="text-red-600">
                                            High-level override controls for system safety.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {isEmergencyPaused ? (
                                            <Button
                                                onClick={handleDisableEmergencyPause}
                                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                Resume System Operations
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleEmergencyPause}
                                                variant="destructive"
                                                className="w-full"
                                            >
                                                Emergency Pause System
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </TimelineContent>

                            {/* State Head Management */}
                            <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">State Head Management</CardTitle>
                                        <CardDescription>Appoint and manage state heads.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Principal ID</label>
                                            <input
                                                type="text"
                                                value={newStateHeadPrincipal}
                                                onChange={(e) => setNewStateHeadPrincipal(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm"
                                                placeholder="aaaaa-aa..."
                                            />
                                        </div>
                                        <Button
                                            onClick={handleProposeStateHead}
                                            disabled={isProposingStateHead}
                                            className="w-full bg-black hover:bg-gray-800 text-white"
                                        >
                                            {isProposingStateHead ? 'Proposing...' : 'Propose State Head'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TimelineContent>

                            {/* Vendor Registry */}
                            <TimelineContent as="div" animationNum={3.5} timelineRef={dashboardRef as React.RefObject<HTMLElement>} customVariants={revealVariants}>
                                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold">Vendor Registry</CardTitle>
                                        <CardDescription>Approved vendors in the ecosystem.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {vendors.map((vendor) => (
                                                <div key={vendor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{vendor.name}</p>
                                                        <p className="text-xs text-gray-500">{vendor.businessType}</p>
                                                    </div>
                                                    <Badge variant={vendor.status === 'approved' ? 'default' : 'secondary'}>
                                                        {vendor.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TimelineContent>
                        </div>
                    </div>
                </main>

                {/* Modals */}
                <Dialog open={isPauseConfirmationOpen} onOpenChange={setIsPauseConfirmationOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Emergency Pause</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to pause the entire system? This will halt all budget allocations and claim processing immediately.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPauseConfirmationOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmEmergencyPause}>Yes, Pause System</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDisableConfirmationOpen} onOpenChange={setIsDisableConfirmationOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Resume System Operations</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to resume system operations? This will re-enable all financial activities.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDisableConfirmationOpen(false)}>Cancel</Button>
                            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={confirmDisableEmergencyPause}>Yes, Resume</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {selectedClaim && (
                    <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Claim Details #{selectedClaim.id}</DialogTitle>
                                <DialogDescription>
                                    Submitted by {selectedClaim.vendor}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500">Amount</p>
                                        <p className="text-2xl font-bold text-gray-900">${(selectedClaim.amount || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500">Risk Score</p>
                                        <div className="flex items-center mt-1">
                                            <span className={`text-2xl font-bold ${selectedClaim.riskLevel === 'critical' ? 'text-red-600' :
                                                    selectedClaim.riskLevel === 'high' ? 'text-orange-600' :
                                                        'text-green-600'
                                                }`}>
                                                {selectedClaim.fraudScore || 0}
                                            </span>
                                            <span className="ml-2 text-sm text-gray-500">/ 100</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900">Description</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        {selectedClaim.description || "No description provided."}
                                    </p>
                                </div>

                                {selectedClaim.invoiceHash && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-900">Documents</h4>
                                        <div className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg">
                                            <FileText className="h-5 w-5 mr-2" />
                                            <span className="text-sm truncate flex-1">{selectedClaim.invoiceHash}</span>
                                            <Button variant="ghost" size="sm" className="ml-2">View</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setSelectedClaim(null)}>Close</Button>
                                <Button variant="destructive">Reject Claim</Button>
                                <Button className="bg-green-600 hover:bg-green-700 text-white">Approve Payment</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </section>
        </>
    );
}
