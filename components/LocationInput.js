"use client";

import React, { useState, useEffect, useRef } from 'react';
import './LocationInput.css';

const LocationInput = ({ 
  label, 
  icon, 
  placeholder, 
  value, 
  onChange,
  onSelectLocation 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef(null);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    // Fallback locations for Lagos
    const FALLBACK_LOCATIONS = [
      { display_name: "Lekki Phase 1, Lagos", lat: "6.4478", lon: "3.4723", address: { name: "Lekki Phase 1" } },
      { display_name: "Victoria Island, Lagos", lat: "6.4281", lon: "3.4219", address: { name: "Victoria Island" } },
      { display_name: "Ikeja City Mall, Lagos", lat: "6.6142", lon: "3.3581", address: { name: "Ikeja City Mall" } },
      { display_name: "Murtala Muhammed International Airport, Lagos", lat: "6.5774", lon: "3.3210", address: { name: "MMIA" } },
      { display_name: "Landmark Beach, Lagos", lat: "6.4266", lon: "3.4337", address: { name: "Landmark Beach" } },
      { display_name: "Eko Hotels & Suites, Lagos", lat: "6.4253", lon: "3.4301", address: { name: "Eko Hotels" } },
      { display_name: "Surulere, Lagos", lat: "6.4973", lon: "3.3577", address: { name: "Surulere" } },
      { display_name: "Yaba, Lagos", lat: "6.5095", lon: "3.3711", address: { name: "Yaba" } },
    ];

    try {
      const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
      
      if (!apiKey) {
        console.warn('LocationIQ API key not found. Using fallback locations.');
        const filtered = FALLBACK_LOCATIONS.filter(loc => 
          loc.display_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
        setIsLoading(false);
        return;
      }

      // Search specifically in Lagos, Nigeria
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=ng&tag=place:city,place:town,place:suburb,place:neighbourhood`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      
      // Filter for Lagos-specific results
      const lagosResults = data.filter(item => 
        item.display_name.toLowerCase().includes('lagos')
      );

      setSuggestions(lagosResults.length > 0 ? lagosResults : FALLBACK_LOCATIONS.filter(loc => 
        loc.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } catch (error) {
      console.warn('Error fetching suggestions, using fallback:', error);
      // Use fallback data on error
      const filtered = FALLBACK_LOCATIONS.filter(loc => 
        loc.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setShowSuggestions(true);

    if (onChange) {
      onChange(e);
    }

    // Debounce API calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newQuery);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion) => {
    const locationName = suggestion.address?.name || suggestion.display_name.split(',')[0];
    setShowSuggestions(false);
    setSuggestions([]);

    if (onSelectLocation) {
      onSelectLocation({
        name: locationName,
        displayName: suggestion.display_name,
        lat: suggestion.lat,
        lon: suggestion.lon,
      });
    }

    if (onChange) {
      onChange({ target: { value: locationName } });
    }
  };

  return (
    <div className="location-input-wrapper" ref={wrapperRef}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className="input-field"
          type="text"
          placeholder={placeholder}
          value={value || ''}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
        />
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list glass-panel">
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.place_id}-${index}`}
              className="suggestion-item"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <span className="suggestion-icon">📍</span>
              <div className="suggestion-content">
                <div className="suggestion-name">
                  {suggestion.address?.name || suggestion.display_name.split(',')[0]}
                </div>
                <div className="suggestion-address">
                  {suggestion.display_name}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
