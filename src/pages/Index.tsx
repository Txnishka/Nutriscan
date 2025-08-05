import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import LandingAnimation from '@/components/LandingAnimation';
import { useLocation } from 'react-router-dom';


const Index = () => {
  const [showLandingAnimation, setShowLandingAnimation] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('fromNavbar') === 'true') {
      setShowLandingAnimation(false);
    }
  }, [location.search]);

  const handleAnimationFinish = () => {
    setShowLandingAnimation(false);
  };

  return (
    <div>
      {showLandingAnimation ? (
        <LandingAnimation onFinish={handleAnimationFinish} />
      ) : (
        <div className="min-h-screen bg-background pt-8 sm:pt-16">
          <Navbar />
          <Hero /> 
          <Features />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Index;
