import { Header } from './Header';
import { LampDemo } from '../Demo/LampDemo';
import PricingSection3 from '../ui/pricing-section-2';
import CaseStudies from '../ui/case-studies';
import { ICPSolution } from './ICPSolution';
import { StatsDashboard } from './StatsDashboard';
import { SectorShowcase } from './SectorShowcase';

export function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <LampDemo />
      <SectorShowcase />
      <CaseStudies />
      <ICPSolution />
      <PricingSection3 />
      <StatsDashboard />
    </div>
  );
}
