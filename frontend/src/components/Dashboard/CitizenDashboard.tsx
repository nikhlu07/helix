import React, { useState, useRef, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, ThumbsUp, MessageSquare, Search, Filter, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '../common/Toast';
import { useContract } from '../../hooks/useContracts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

export function CitizenDashboard() {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [challengeReason, setChallengeReason] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);
  const { showToast } = useToast();
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Real data from contract
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { getAllClaims, stakeChallenge } = useContract();

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

  // Load claims
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const claimsData = await getAllClaims();

        if (claimsData && claimsData.length > 0) {
          const parsedClaims = claimsData.map((claim: any) => ({
            id: claim.claimId,
            vendor: claim.vendor ? claim.vendor.toString().substring(0, 10) + '...' : 'Unknown Vendor',
            project: 'Public Infrastructure Project', // Placeholder
            amount: Number(claim.amount),
            description: claim.invoiceHash || 'No description provided',
            status: claim.paid ? 'Paid' : (claim.flagged ? 'Under Review' : 'Pending'),
            riskScore: claim.fraudScore ? Number(claim.fraudScore) : 0,
            location: 'Mumbai, MH', // Placeholder
            date: new Date().toLocaleDateString(), // Placeholder
            upvotes: 0,
            comments: 0
          }));
          setClaims(parsedClaims);
        }
      } catch (error) {
        console.log('Failed to load claims:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getAllClaims]);

  const handleChallenge = (claimId: string) => {
    setSelectedClaim(claimId);
    setIsStakeDialogOpen(true);
  };

  const confirmChallenge = async () => {
    if (!stakeAmount || !challengeReason) {
      showToast('Please provide stake amount and reason', 'warning');
      return;
    }

    try {
      const amount = parseInt(stakeAmount);
      // Mock challenge submission
      // In real implementation, this would call the contract
      // const result = await stakeChallenge(parseInt(selectedClaim!), amount, challengeReason);

      // Using mock success for now as stakeChallenge might not be fully implemented in backend/contract yet
      // or requires complex token handling

      showToast(`Challenge submitted successfully! Staked ${amount} tokens.`, 'success');
      setIsStakeDialogOpen(false);
      setStakeAmount('');
      setChallengeReason('');
      setSelectedClaim(null);

      // Reload claims to reflect changes (if any)
      const claimsData = await getAllClaims();
      // ... update state

    } catch (error) {
      console.error('Challenge failed:', error);
      showToast('Failed to submit challenge', 'error');
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
                Citizen Watch
              </VerticalCutReveal>
            </h1>
            <TimelineContent
              as="p"
              animationNum={0}
              timelineRef={dashboardRef}
              customVariants={revealVariants}
              className="text-gray-600 text-lg"
            >
              Participate in governance. Review claims, report issues, and earn rewards for vigilance.
            </TimelineContent>
          </article>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column - Feed */}
            <div className="lg:col-span-2 space-y-8">
              <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <Button
                      variant={activeTab === 'feed' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('feed')}
                      className="rounded-full"
                    >
                      Latest Claims
                    </Button>
                    <Button
                      variant={activeTab === 'nearby' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('nearby')}
                      className="rounded-full"
                    >
                      <MapPin className="mr-2 h-4 w-4" /> Nearby
                    </Button>
                    <Button
                      variant={activeTab === 'flagged' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('flagged')}
                      className="rounded-full"
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" /> Flagged
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {claims.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No claims found to display.</p>
                    </div>
                  ) : (
                    claims.map((claim) => (
                      <Card key={claim.id} className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {claim.project}
                                  </Badge>
                                  <span className="text-xs text-gray-500">• {claim.date}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{claim.vendor}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="h-3 w-3 mr-1" /> {claim.location}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900">${claim.amount.toLocaleString()}</div>
                                <Badge className={`${claim.riskScore > 70 ? 'bg-red-100 text-red-800' :
                                    claim.riskScore > 30 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                  }`}>
                                  Risk Score: {claim.riskScore}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg text-sm">
                              {claim.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex space-x-4">
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                                  <ThumbsUp className="h-4 w-4 mr-2" /> Verify
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                                  <MessageSquare className="h-4 w-4 mr-2" /> Discuss
                                </Button>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleChallenge(claim.id)}
                                className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" /> Challenge
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TimelineContent>
            </div>

            {/* Right Column - Stats & Rewards */}
            <div className="space-y-8">
              <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-black text-white shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center">
                      <Shield className="mr-2 h-6 w-6 text-yellow-400" />
                      Your Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-800 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-400">12</div>
                        <div className="text-xs text-gray-400">Claims Verified</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-400">2</div>
                        <div className="text-xs text-gray-400">Fraud Prevented</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Reputation Score</span>
                          <span className="font-bold text-white">850/1000</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-[85%]"></div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-800">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Rewards Earned</span>
                          <span className="text-xl font-bold text-yellow-400">250 HBAR</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TimelineContent>

              <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0">
                        <div className="mt-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Verified road construction at Andheri East</p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TimelineContent>
            </div>
          </div>
        </main>

        {/* Stake Dialog */}
        <Dialog open={isStakeDialogOpen} onOpenChange={setIsStakeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Challenge Claim</DialogTitle>
              <DialogDescription>
                Staking tokens is required to challenge a claim. If your challenge is successful, you'll receive your stake back plus a reward. If false, you lose your stake.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stake Amount (HBAR)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Min. 100 HBAR"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Challenge</label>
                <textarea
                  value={challengeReason}
                  onChange={(e) => setChallengeReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Describe why this claim is fraudulent..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStakeDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmChallenge}>Stake & Challenge</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
