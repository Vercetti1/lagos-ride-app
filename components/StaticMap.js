"use client";

import { useEffect, useRef } from 'react';

const StaticMap = ({ pickup, dropoff }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Default to Lagos coordinates
    const lat = pickup?.lat || 6.5244;
    const lon = pickup?.lon || 3.3792;
    const zoom = 12;

    const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
    
    if (!apiKey) {
      console.warn('LocationIQ API key not found');
      return;
    }

    // Create static map URL
    const mapUrl = `https://maps.locationiq.com/v3/staticmap?key=${apiKey}&center=${lat},${lon}&zoom=${zoom}&size=600x500&format=png&maptype=streets`;
    
    mapRef.current.style.backgroundImage = `url('${mapUrl}')`;
    mapRef.current.style.backgroundSize = 'cover';
    mapRef.current.style.backgroundPosition = 'center';
  }, [pickup, dropoff]);

  return (
    <div 
      ref={mapRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
      }}
    />
  );
};

export default StaticMap;
