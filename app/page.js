"use client";

import React, { useState, useEffect } from 'react';
import { IoLocationSharp, IoFlag, IoCash, IoFlash, IoShieldCheckmark, IoCheckmarkCircle, IoCar, IoEllipse } from 'react-icons/io5';
import styles from './page.module.css';
import LocationInput from '../components/LocationInput';
import Button from '../components/Button';
import RideCard from '../components/RideCard';
import RideStatus from '../components/RideStatus';
import StaticMap from '../components/StaticMap';

export default function Home() {
  const [selectedRide, setSelectedRide] = useState('lite');
  const [rideStatus, setRideStatus] = useState('idle'); // idle, searching, confirmed, arriving
  const [pickup, setPickup] = useState({ name: 'Lekki Phase 1', lat: null, lon: null });
  const [dropoff, setDropoff] = useState({ name: '', lat: null, lon: null });

  const handleRequestRide = () => {
    if (!pickup.name || !dropoff.name) {
      alert('Please select both pickup and dropoff locations');
      return;
    }

    setRideStatus('searching');
    
    // Simulate finding a driver
    setTimeout(() => {
      setRideStatus('confirmed');
      
      // Simulate driver arriving
      setTimeout(() => {
        setRideStatus('arriving');
      }, 5000);
    }, 3000);
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

              <Button 
                variant="primary" 
                className="w-full mt-4"
                onClick={handleRequestRide}
              >
                Request Ride
              </Button>
            </>
          ) : (
            <RideStatus 
              status={rideStatus} 
              onCancel={handleCancelRide}
            />
          )}
        </div>

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
