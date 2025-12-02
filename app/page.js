"use client";

import React, { useState, useEffect } from 'react';
import { IoLocationSharp, IoFlag, IoCash, IoFlash, IoShieldCheckmark, IoCheckmarkCircle, IoCar, IoEllipse, IoWallet } from 'react-icons/io5';
import styles from './page.module.css';
import LocationInput from '../components/LocationInput';
import Button from '../components/Button';
import RideCard from '../components/RideCard';
import RideStatus from '../components/RideStatus';
import StaticMap from '../components/StaticMap';
import PaymentModal from '../components/PaymentModal';
import { useToast } from '../hooks/useToast';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const toast = useToast();
  const [selectedRide, setSelectedRide] = useState('lite');
  const [rideStatus, setRideStatus] = useState('idle'); // idle, searching, confirmed, arriving
  const [pickup, setPickup] = useState({ name: 'Lekki Phase 1', lat: null, lon: null });
  const [dropoff, setDropoff] = useState({ name: '', lat: null, lon: null });
  
  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(5000); // Mock balance
  const [rideCost, setRideCost] = useState(1200);

  // Update cost when ride type changes
  useEffect(() => {
    const costs = { lite: 1200, premium: 2500, van: 4000 };
    setRideCost(costs[selectedRide]);
  }, [selectedRide]);

  const handleRequestRide = () => {
    if (!pickup.name || !dropoff.name) {
      toast.error('Please select both pickup and dropoff locations');
      return;
    }

    if (!session) {
      toast.warning('Please log in to book a ride');
      return;
    }

    // Check balance
    if (walletBalance < rideCost) {
      toast.error('Insufficient wallet balance. Please fund your wallet.');
      setShowPaymentModal(true);
      return;
    }

    // Deduct balance and start ride
    setWalletBalance(prev => prev - rideCost);
    toast.success(`Ride requested! ₦${rideCost.toLocaleString()} deducted from wallet.`);
    setRideStatus('searching');
    
    // Simulate finding a driver
    setTimeout(() => {
      setRideStatus('confirmed');
      toast.info('Driver found! Chidi is on the way.');
      
      // Simulate driver arriving
      setTimeout(() => {
        setRideStatus('arriving');
        toast.success('Driver has arrived!');
      }, 5000);
    }, 3000);
  };

  const handleFundSuccess = (response) => {
    // In real app, verify transaction first
    const amount = parseInt(response.amount) / 100; // Convert kobo to naira (if amount comes from response) or use state
    // For simplicity using the amount we know was requested or just adding a fixed amount for demo if needed
    // But better to rely on what we passed to modal. 
    // Let's assume the modal handles the funding logic and we just update UI here
    // Actually, PaymentModal calls onSuccess with response. We need to know amount.
    // Let's rely on the user seeing the success toast from PaymentModal or here.
    
    // For this demo, we'll just add 5000 if we don't track the specific amount in this parent component easily
    // But wait, the PaymentModal is for funding specific amount. 
    // Let's just show success message here.
    toast.success('Wallet funded successfully! Please try booking again.');
    setWalletBalance(prev => prev + 5000); // Mock funding
  };

  const handleCancelRide = () => {
    setRideStatus('idle');
  };

  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Ride the <span className="text-gradient">Future</span> of Lagos
        </h1>
        <p className={styles.heroSubtitle}>
          Experience seamless, secure, and lightning-fast transportation across the city.
        </p>
      </section>

      <section id="ride" className={styles.bookingSection}>
        <div className={`glass-panel ${styles.bookingForm}`}>
          {rideStatus === 'idle' ? (
            <>
              <h2 className="text-xl font-bold mb-2">Where to?</h2>
              
              <div className="flex flex-col gap-4">
                <LocationInput 
                  placeholder="Pickup Location" 
                  icon={<IoLocationSharp />}
                  value={pickup.name}
                  onChange={(e) => setPickup({ ...pickup, name: e.target.value })}
                  onSelectLocation={(location) => setPickup({ 
                    name: location.name, 
                    lat: location.lat, 
                    lon: location.lon 
                  })}
                />
                <LocationInput 
                  placeholder="Dropoff Location" 
                  icon={<IoFlag />}
                  value={dropoff.name}
                  onChange={(e) => setDropoff({ ...dropoff, name: e.target.value })}
                  onSelectLocation={(location) => setDropoff({ 
                    name: location.name, 
                    lat: location.lat, 
                    lon: location.lon 
                  })}
                />
              </div>

              <div className={styles.rideOptions}>
                <RideCard 
                  title="Lagos Lite" 
                  time="5 mins away" 
                  price="₦1,200"
                  selected={selectedRide === 'lite'}
                  onClick={() => setSelectedRide('lite')}
                />
                <RideCard 
                  title="Lagos Premium" 
                  time="8 mins away" 
                  price="₦2,500"
                  selected={selectedRide === 'premium'}
                  onClick={() => setSelectedRide('premium')}
                />
                <RideCard 
                  title="Lagos Van" 
                  time="12 mins away" 
                  price="₦4,000"
                  selected={selectedRide === 'van'}
                  onClick={() => setSelectedRide('van')}
                />
              </div>

              <div className="flex justify-between items-center mt-4 mb-2 px-1">
                <div className="text-sm text-gray-400">Wallet Balance:</div>
                <div className="font-bold text-white flex items-center gap-1">
                  <IoWallet className="text-emerald-400" />
                  ₦{walletBalance.toLocaleString()}
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full"
                onClick={handleRequestRide}
              >
                Request Ride (₦{rideCost.toLocaleString()})
              </Button>
            </>
          ) : (
            <RideStatus 
              status={rideStatus} 
              onCancel={handleCancelRide}
            />
          )}
        </div>

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={Math.max(1000, rideCost - walletBalance + 500)} // Suggest amount needed + buffer
          email={session?.user?.email}
          onSuccess={handleFundSuccess}
          title="Insufficient Funds"
          description={`Please fund your wallet to pay for this ride (₦${rideCost.toLocaleString()})`}
        />

        <div className={styles.mapPlaceholder}>
          <StaticMap pickup={pickup} dropoff={dropoff} />
          <div className={styles.mapGrid}></div>
          
          {/* Location Markers */}
          {pickup.lat && (
            <div className={styles.pickupMarker} title={pickup.name}>
              <IoLocationSharp size={24} />
            </div>
          )}
          {dropoff.lat && (
            <div className={styles.dropoffMarker} title={dropoff.name}>
              <IoFlag size={24} />
            </div>
          )}
          
          {/* Route Line */}
          {pickup.lat && dropoff.lat && (
            <div className={styles.routeLine}></div>
          )}
          
          {/* User Location Pulse */}
          <div className={styles.mapPulse}></div>
          
          {/* Map Controls */}
          <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', gap: 10 }}>
            <Button variant="secondary" style={{ padding: '8px', minWidth: '40px' }}>+</Button>
            <Button variant="secondary" style={{ padding: '8px', minWidth: '40px' }}>-</Button>
          </div>
          
          {/* Map Legend */}
          <div className={styles.mapLegend}>
            <div className={styles.legendItem}>
              <IoLocationSharp size={16} /> Your Location
            </div>
            {pickup.name && pickup.name !== 'Lekki Phase 1' && (
              <div className={styles.legendItem}>
                <IoEllipse size={16} color="#10b981" /> Pickup: {pickup.name}
              </div>
            )}
            {dropoff.name && (
              <div className={styles.legendItem}>
                <IoEllipse size={16} color="#ef4444" /> Dropoff: {dropoff.name}
              </div>
            )}
          </div>
          
          {/* Simulated Driver Marker */}
          {rideStatus !== 'idle' && (
            <div className={styles.driverMarker}>
              <IoCar size={24} />
            </div>
          )}
        </div>
      </section>

      {/* Drive Section */}
      <section id="drive" className={styles.driveSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            Drive with <span className="text-gradient">LagosRide</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Earn on your own terms with our futuristic fleet. Join the revolution of transportation in Lagos.
          </p>
          
          <div className={styles.featuresGrid}>
            <div className={`glass-panel ${styles.featureCard}`}>
              <div className={styles.featureIcon}><IoCash size={40} /></div>
              <h3>High Earnings</h3>
              <p>Keep more of what you earn with our low commission rates.</p>
            </div>
            <div className={`glass-panel ${styles.featureCard}`}>
              <div className={styles.featureIcon}><IoFlash size={40} /></div>
              <h3>Electric Fleet</h3>
              <p>Drive our state-of-the-art electric vehicles. No fuel costs.</p>
            </div>
            <div className={`glass-panel ${styles.featureCard}`}>
              <div className={styles.featureIcon}><IoShieldCheckmark size={40} /></div>
              <h3>Safety First</h3>
              <p>24/7 support and advanced safety features for peace of mind.</p>
            </div>
          </div>

          <Button variant="primary" className="mt-8">
            Become a Driver
          </Button>
        </div>
      </section>

      {/* Business Section */}
      <section id="business" className={styles.businessSection}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>
            LagosRide for <span className="text-gradient">Business</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Reliable transportation solutions for your team and clients.
          </p>

          <div className={styles.businessGrid}>
            <div className={styles.businessInfo}>
              <ul className={styles.benefitList}>
                <li><IoCheckmarkCircle size={20} style={{marginRight: '8px', color: '#10b981'}} /> Centralized billing and reporting</li>
                <li><IoCheckmarkCircle size={20} style={{marginRight: '8px', color: '#10b981'}} /> Priority vehicle dispatch</li>
                <li><IoCheckmarkCircle size={20} style={{marginRight: '8px', color: '#10b981'}} /> Dedicated account management</li>
                <li><IoCheckmarkCircle size={20} style={{marginRight: '8px', color: '#10b981'}} /> Employee travel perks</li>
              </ul>
              <Button variant="secondary" className="mt-8">
                Get Started
              </Button>
            </div>
            <div className={`glass-panel ${styles.businessCard}`}>
              <h3>Corporate Dashboard</h3>
              <div className={styles.mockChart}>
                <div className={styles.chartBar} style={{height: '40%'}}></div>
                <div className={styles.chartBar} style={{height: '70%'}}></div>
                <div className={styles.chartBar} style={{height: '50%'}}></div>
                <div className={styles.chartBar} style={{height: '90%'}}></div>
                <div className={styles.chartBar} style={{height: '60%'}}></div>
              </div>
              <p className="text-sm text-gray-400 mt-4">Real-time expense tracking</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
