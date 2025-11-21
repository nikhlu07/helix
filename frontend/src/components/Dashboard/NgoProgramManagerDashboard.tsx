import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, MapPin, FileText, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useContract } from '../../hooks/useContracts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export function NgoProgramManagerDashboard() {
    const { showToast } = useToast();
    const dashboardRef = useRef<HTMLDivElement>(null);

    // Real data from contract
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const { getAllClaims } = useContract();

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
                const claimsData = await getAllClaims();
                if (claimsData) setClaims(claimsData);
            } catch (error) {
                console.log('Data loading failed:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [getAllClaims]);

    const handleVerifyClaim = (claimId: string) => {
        showToast(`Claim #${claimId} verified successfully`, 'success');
        // In real app, would call contract to verify
    };

    const handleFlagClaim = (claimId: string) => {
        showToast(`Claim #${claimId} flagged for review`, 'warning');
        // In real app, would call contract to flag
    };

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
                            Field Verification Dashboard
                        </VerticalCutReveal>
                    </h1>
                    <TimelineContent
                        as="p"
                        animationNum={0}
                        timelineRef={dashboardRef}
                        customVariants={revealVariants}
                        className="text-gray-600 text-lg"
                    >
                        Verify project completion, inspect sites, and validate vendor claims on the ground.
                    </TimelineContent>
                </article>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Pending Verifications */}
                        <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">Pending Verifications</CardTitle>
                                    <CardDescription>Claims requiring field inspection.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {claims.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                                            <p>All claims verified!</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {claims.map((claim) => (
                                                <div key={claim.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h3 className="font-bold text-lg">{claim.vendor || 'Unknown Vendor'}</h3>
                                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                                <MapPin className="h-3 w-3 mr-1" /> Mumbai Central
                                                                <span className="mx-2">•</span>
                                                                <Clock className="h-3 w-3 mr-1" /> 2 days ago
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                            Pending Verification
                                                        </Badge>
                                                    </div>

                                                    <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded">
                                                        {claim.description || 'No description provided.'}
                                                    </p>

                                                    <div className="flex justify-between items-center pt-3 border-t">
                                                        <span className="font-bold">${(claim.amount || 0).toLocaleString()}</span>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleFlagClaim(claim.id)}
                                                                className="text-red-600 hover:bg-red-50 border-red-200"
                                                            >
                                                                <AlertTriangle className="h-4 w-4 mr-2" /> Flag Issue
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleVerifyClaim(claim.id)}
                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-2" /> Verify Completion
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TimelineContent>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* My Stats */}
                        <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                            <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold">My Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center">
                                            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                            <span className="font-medium">Verified</span>
                                        </div>
                                        <span className="font-bold text-green-700">24</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <div className="flex items-center">
                                            <XCircle className="h-5 w-5 text-red-600 mr-3" />
                                            <span className="font-medium">Rejected</span>
                                        </div>
                                        <span className="font-bold text-red-700">3</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center">
                                            <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                                            <span className="font-medium">Sites Visited</span>
                                        </div>
                                        <span className="font-bold text-blue-700">18</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </TimelineContent>
                    </div>
                </div>
            </main>
        </section>
    );
}
