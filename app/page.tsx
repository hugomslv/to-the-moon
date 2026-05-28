// Landing page principale – To The Moon CTF
// Assemblage des sections (composants client individuels)
import NavBar from '@/components/home/NavBar';
import HeroSection from '@/components/home/HeroSection';
import StartSection from '@/components/home/StartSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import LeaderboardSection from '@/components/home/LeaderboardSection';
import StatsSection from '@/components/home/StatsSection';
import Footer from '@/components/home/Footer';

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <StartSection />
        <HowItWorksSection />
        <LeaderboardSection />
        <StatsSection />
      </main>
      <Footer />
    </>
  );
}
