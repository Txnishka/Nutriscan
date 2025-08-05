import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Scanner from '@/components/Scanner';
import Footer from '@/components/Footer';

const ScannerPage = () => { 
  return (
    <div className="min-h-screen">
      <Navbar isScannerPage={true} />
      <div className="pt-16">
        <Scanner />
      </div>
      <Footer />
    </div>
  );
};

export default ScannerPage;
