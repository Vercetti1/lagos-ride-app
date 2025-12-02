"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { IoArrowBack, IoCalendar, IoLocation, IoCar, IoTime, IoReceipt } from 'react-icons/io5';
import { format } from 'date-fns';
import Button from '../../components/Button';
import './history.css';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Mock ride history data
  const [rides, setRides] = useState([
    {
      id: 1,
      date: new Date('2024-12-02T14:30:00'),
      pickup: 'Lekki Phase 1',
      dropoff: 'Victoria Island',
      rideType: 'Lagos Premium',
      amount: 2500,
      driver: 'Chidi Okafor',
      status: 'completed',
      duration: '25 mins',
    },
    {
      id: 2,
      date: new Date('2024-12-01T09:15:00'),
      pickup: 'Ikeja City Mall',
      dropoff: 'Surulere',
      rideType: 'Lagos Lite',
      amount: 1200,
      driver: 'Amina Hassan',
      status: 'completed',
      duration: '18 mins',
    },
    {
      id: 3,
      date: new Date('2024-11-30T18:45:00'),
      pickup: 'MMIA Airport',
      dropoff: 'Lekki Phase 1',
      rideType: 'Lagos Van',
      amount: 4000,
      driver: 'Tunde Bakare',
      status: 'completed',
      duration: '45 mins',
    },
  ]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="loading-container">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <Button variant="ghost" onClick={() => router.push('/')}>
            <IoArrowBack size={20} /> Back to Home
          </Button>
          <h1>Ride History</h1>
        </div>

        <div className="history-stats glass-panel">
          <div className="stat-item">
            <div className="stat-value">{rides.length}</div>
            <div className="stat-label">Total Rides</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">₦{rides.reduce((sum, ride) => sum + ride.amount, 0).toLocaleString()}</div>
            <div className="stat-label">Total Spent</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {Math.round(rides.reduce((sum, ride) => sum + ride.amount, 0) / rides.length).toLocaleString()}
            </div>
            <div className="stat-label">Avg. Fare</div>
          </div>
        </div>

        <div className="rides-list">
          {rides.length === 0 ? (
            <div className="empty-state glass-panel">
              <IoCar size={64} style={{ opacity: 0.3 }} />
              <h3>No rides yet</h3>
              <p>Your ride history will appear here</p>
              <Button variant="primary" onClick={() => router.push('/')}>
                Book Your First Ride
              </Button>
            </div>
          ) : (
            rides.map((ride) => (
              <div key={ride.id} className="ride-card glass-panel">
                <div className="ride-header">
                  <div className="ride-date">
                    <IoCalendar size={16} />
                    {format(ride.date, 'MMM dd, yyyy')}
                  </div>
                  <div className="ride-time">
                    <IoTime size={16} />
                    {format(ride.date, 'HH:mm')}
                  </div>
                </div>

                <div className="ride-route">
                  <div className="route-point">
                    <div className="route-icon pickup">
                      <IoLocation size={16} />
                    </div>
                    <div className="route-details">
                      <span className="route-label">Pickup</span>
                      <span className="route-location">{ride.pickup}</span>
                    </div>
                  </div>

                  <div className="route-line"></div>

                  <div className="route-point">
                    <div className="route-icon dropoff">
                      <IoLocation size={16} />
                    </div>
                    <div className="route-details">
                      <span className="route-label">Dropoff</span>
                      <span className="route-location">{ride.dropoff}</span>
                    </div>
                  </div>
                </div>

                <div className="ride-details">
                  <div className="detail-item">
                    <IoCar size={16} />
                    <span>{ride.rideType}</span>
                  </div>
                  <div className="detail-item">
                    <IoTime size={16} />
                    <span>{ride.duration}</span>
                  </div>
                  <div className="detail-item">
                    <IoReceipt size={16} />
                    <span>Driver: {ride.driver}</span>
                  </div>
                </div>

                <div className="ride-footer">
                  <div className="ride-amount">₦{ride.amount.toLocaleString()}</div>
                  <Button variant="ghost" size="small">
                    View Receipt
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
