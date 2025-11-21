import React, { useState, useRef, useEffect } from 'react';
import { Eye, BarChart2, FileText, CheckCircle, AlertTriangle, Globe, Heart, Users, TrendingUp } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useContract } from '../../hooks/useContracts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export function NgoHeadDashboard() {
    const { showToast } = useToast();
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Real data from contract
    const [budgets, setBudgets] = useState<any[]>([]);
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const { getAllBudgets, getAllClaims } = useContract();

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

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Load budgets
                const budgetData = await getAllBudgets();
                if (budgetData) setBudgets(budgetData);

                // Load claims
                const claimsData = await getAllClaims();
                if (claimsData) setClaims(claimsData);

            } catch (error) {
                console.log('Data loading failed:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [getAllBudgets, getAllClaims]);

    const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
    const verifiedClaims = claims.filter(c => c.status === 'verified' || c.status === 'paid').length;
    const pendingClaims = claims.filter(c => c.status === 'pending').length;

    return (
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
                            NGO Oversight Dashboard
                        </VerticalCutReveal>
                    </h1>
                    <TimelineContent
                        as="p"
                        animationNum={0}
                        timelineRef={dashboardRef}
                        customVariants={revealVariants}
                        className="text-gray-600 text-lg"
                    >
                        Monitor government spending, verify impact, and ensure transparency.
                    </TimelineContent>
                </article>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Impact Overview */}
                        <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Impact Overview</CardTitle>
                                    <CardDescription>Key metrics on government spending efficiency.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                        <Globe className="h-6 w-6 text-gray-500 mb-2" />
                                        <p className="text-sm font-medium text-gray-600">Monitored Budget</p>
                                        <p className="text-2xl font-bold text-gray-900">${(totalBudget / 1000000).toFixed(1)}M</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                                        <p className="text-sm font-medium text-gray-600">Verified Claims</p>
                                        <p className="text-2xl font-bold text-gray-900">{verifiedClaims}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
                                        <AlertTriangle className="h-6 w-6 text-yellow-500 mb-2" />
                                        <p className="text-sm font-medium text-yellow-600">Pending Review</p>
                                        <p className="text-2xl font-bold text-yellow-600">{pendingClaims}</p>
                                    </div>
                                    <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
                                        <Heart className="h-6 w-6 text-blue-500 mb-2" />
                                        <p className="text-sm font-medium text-blue-600">Social Impact Score</p>
                                        <p className="text-2xl font-bold text-blue-600">8.5/10</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TimelineContent>

                        {/* Budget Monitoring */}
                        <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Budget Monitoring</CardTitle>
                                    <CardDescription>Track allocation vs utilization across sectors.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Budget ID</TableHead>
                                                <TableHead>Purpose</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Details</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {budgets.map((budget) => (
                                                <TableRow key={budget.id} className="hover:bg-gray-50/50">
                                                    <TableCell className="font-mono text-xs">#{budget.id}</TableCell>
                                                    <TableCell>{budget.purpose}</TableCell>
                                                    <TableCell className="font-medium">${(budget.amount || 0).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                                            Active
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm">
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
                        {/* Recent Claims Feed */}
                        <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Recent Claims Feed</CardTitle>
                                    <CardDescription>Real-time feed of vendor claims.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {claims.slice(0, 5).map((claim) => (
                                        <div key={claim.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-sm">{claim.vendor || 'Unknown Vendor'}</h4>
                                                <span className="text-xs text-gray-500">{new Date().toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{claim.description || 'No description'}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold text-sm">${(claim.amount || 0).toLocaleString()}</span>
                                                <Button variant="outline" size="sm" className="h-7 text-xs">Verify</Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TimelineContent>
                    </div>
                </div>
            </main>
        </section>
    );
}
