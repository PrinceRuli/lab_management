import React from 'react';
import Header from '../components/common/LandingHeader';
import Hero from '../components/common/Hero';
import Features from '../components/common/Features';
import Laboratories from './Laboratories';
import Footer from '../components/common/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Laboratories />
      <Footer />
    </div>
  );
};

export default Home;