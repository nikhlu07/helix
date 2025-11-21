import React, { useState, useRef, useEffect } from 'react';
import { Users, Shield, AlertTriangle, TrendingUp, Building, Eye, Mail, Star, BarChart2, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useContract } from '../../hooks/useContracts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export function StateHeadDashboard() {
  const [deputyName, setDeputyName] = useState('');
  const [deputyPrincipal, setDeputyPrincipal] = useState('');
  const [isAddingDeputy, setIsAddingDeputy] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  // Real data from contract
  const [systemStats, setSystemStats] = useState<any>(null);
  const [claims, setClaims] = useState<any[]>([]);
  const [highRiskClaims, setHighRiskClaims] = useState<any[]>([]);
  const [deputies] = useState<any[]>([
    { id: 1, name: "Rajesh Kumar", district: "Mumbai Central", status: "Active", performance: 92 },
    { id: 2, name: "Priya Singh", district: "Pune West", status: "Active", performance: 88 },
    { id: 3, name: "Amit Patel", district: "Nagpur North", status: "Warning", performance: 74 },
  ]);

  const { showToast } = useToast();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { getSystemStats, getAllClaims, addDeputy } = useContract();

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
        // Load system stats
        const stats = await getSystemStats();
        if (stats) setSystemStats(stats);

        // Load claims
        const claimsData = await getAllClaims();
        if (claimsData && claimsData.length > 0) {
          setClaims(claimsData);

          // Filter high risk claims
          const highRisk = claimsData.filter((c: any) =>
            (c.fraudScore && Number(c.fraudScore) > 70) ||
            (c.riskLevel === 'critical' || c.riskLevel === 'high')
          );
          setHighRiskClaims(highRisk);
        }
      } catch (error) {
        console.log('Data loading failed:', error);
      }
    };

    loadData();
  }, [getSystemStats, getAllClaims]);

  const handleAddDeputy = async () => {
    if (!deputyName || !deputyPrincipal) {
      showToast('Please enter deputy name and principal ID', 'warning');
      return;
    }

    setIsAddingDeputy(true);
    try {
      const result = await addDeputy(deputyPrincipal, deputyName);
      if (result) {
        showToast(`Deputy ${deputyName} appointed successfully`, 'success');
        setDeputyName('');
        setDeputyPrincipal('');
      } else {
        showToast('Failed to appoint deputy', 'error');
      }
    } catch (error) {
      console.error('Error adding deputy:', error);
      showToast('Failed to appoint deputy', 'error');
    } finally {
      setIsAddingDeputy(false);
    }
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
                State Head Dashboard
              </VerticalCutReveal>
            </h1>
            <TimelineContent
              as="p"
              animationNum={0}
              timelineRef={dashboardRef}
              customVariants={revealVariants}
              className="text-gray-600 text-lg"
            >
              Oversee district performance, manage deputies, and monitor state-level metrics.
            </TimelineContent>
          </article>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* State Overview */}
              <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">State Overview</CardTitle>
                    <CardDescription>Key performance indicators for the state.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                      <Building className="h-6 w-6 text-gray-500 mb-2" />
                      <p className="text-sm font-medium text-gray-600">Total Districts</p>
                      <p className="text-2xl font-bold text-gray-900">36</p>
                    </div>
                    <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                      <Users className="h-6 w-6 text-gray-500 mb-2" />
                      <p className="text-sm font-medium text-gray-600">Active Deputies</p>
                      <p className="text-2xl font-bold text-gray-900">{deputies.length}</p>
                    </div>
                    <div className="flex flex-col p-4 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-500 mb-2" />
                      <p className="text-sm font-medium text-red-600">Critical Issues</p>
                      <p className="text-2xl font-bold text-red-600">{highRiskClaims.length}</p>
                    </div>
                    <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-500 mb-2" />
                      <p className="text-sm font-medium text-green-600">Avg Performance</p>
                      <p className="text-2xl font-bold text-green-600">85%</p>
                    </div>
                  </CardContent>
                </Card>
              </TimelineContent>

              {/* High Risk Claims Review */}
              <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-red-700 flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      High Risk Claims Attention Required
                    </CardTitle>
                    <CardDescription>Claims flagged with high fraud scores requiring immediate review.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {highRiskClaims.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                        <p>No high risk claims pending review.</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Claim ID</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Fraud Score</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {highRiskClaims.map((claim) => (
                            <TableRow key={claim.id} className="hover:bg-red-50/50">
                              <TableCell className="font-mono text-xs">#{claim.id}</TableCell>
                              <TableCell>Mumbai Central</TableCell>
                              <TableCell className="font-medium">${(claim.amount || 0).toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant="destructive" className="bg-red-100 text-red-800">
                                  {claim.fraudScore}
                                </Badge>
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
                    )}
                  </CardContent>
                </Card>
              </TimelineContent>

              {/* District Performance */}
              <TimelineContent as="div" animationNum={3} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">District Performance</CardTitle>
                    <CardDescription>Performance metrics of appointed deputies.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Deputy</TableHead>
                          <TableHead>District</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Performance</TableHead>
                          <TableHead className="text-right">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deputies.map((deputy) => (
                          <TableRow key={deputy.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">{deputy.name}</TableCell>
                            <TableCell>{deputy.district}</TableCell>
                            <TableCell>
                              <Badge variant={deputy.status === 'Active' ? 'default' : 'secondary'} className={
                                deputy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }>
                                {deputy.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                                  <div className={`h-2.5 rounded-full ${deputy.performance > 90 ? 'bg-green-600' :
                                      deputy.performance > 75 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} style={{ width: `${deputy.performance}%` }}></div>
                                </div>
                                <span className="text-xs text-gray-600">{deputy.performance}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <BarChart2 className="h-4 w-4" />
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
              {/* Appoint Deputy */}
              <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Appoint Deputy</CardTitle>
                    <CardDescription>Assign a new deputy to a district.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Deputy Name</label>
                      <input
                        type="text"
                        value={deputyName}
                        onChange={(e) => setDeputyName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Principal ID</label>
                      <input
                        type="text"
                        value={deputyPrincipal}
                        onChange={(e) => setDeputyPrincipal(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm"
                        placeholder="aaaaa-aa..."
                      />
                    </div>
                    <Button
                      onClick={handleAddDeputy}
                      disabled={isAddingDeputy}
                      className="w-full bg-black hover:bg-gray-800 text-white"
                    >
                      {isAddingDeputy ? 'Appointing...' : 'Appoint Deputy'}
                    </Button>
                  </CardContent>
                </Card>
              </TimelineContent>

              {/* Notifications */}
              <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Notifications</CardTitle>
                    <CardDescription>Recent alerts and updates.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">High Fraud Risk Detected</p>
                        <p className="text-xs text-gray-500">District: Nagpur North • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Budget Approval Request</p>
                        <p className="text-xs text-gray-500">District: Pune West • 5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Project Completed</p>
                        <p className="text-xs text-gray-500">District: Mumbai Central • 1 day ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TimelineContent>
            </div>
          </div>
        </main>

        {selectedClaim && (
          <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>High Risk Claim Review #{selectedClaim.id}</DialogTitle>
                <DialogDescription>
                  Detailed analysis required for high fraud score.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-2xl font-bold text-gray-900">${(selectedClaim.amount || 0).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <p className="text-sm font-medium text-red-600">Fraud Score</p>
                    <div className="flex items-center mt-1">
                      <span className="text-2xl font-bold text-red-700">
                        {selectedClaim.fraudScore || 0}
                      </span>
                      <span className="ml-2 text-sm text-red-500">/ 100</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">AI Analysis</h4>
                  <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 border border-yellow-100">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Amount exceeds historical average by 45%</li>
                      <li>Vendor location mismatch with project site</li>
                      <li>Document metadata inconsistencies detected</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedClaim.description || "No description provided."}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedClaim(null)}>Close</Button>
                <Button variant="destructive">Reject & Flag Vendor</Button>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">Request Audit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </section>
    </>
  );
}
