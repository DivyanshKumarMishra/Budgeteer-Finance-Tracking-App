import { Separator } from '@/components/ui/separator';
import Features from '@/custom_components/home/Features';
import HeroSection from '@/custom_components/home/HeroSection';
import HowItWorks from '@/custom_components/home/HowItWorks';
import QuickAction from '@/custom_components/home/QuickAction';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen gap-y-5">
      <HeroSection />
      <Separator />
      <Features />
      <Separator />
      <HowItWorks />
      <Separator />
      <QuickAction />
    </div>
  );
};

export default Home;
