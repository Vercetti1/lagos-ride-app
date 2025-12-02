"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import Button from './Button';
import UserDropdown from './UserDropdown';
import './Header.css';

const Header = () => {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header glass-panel ${mounted && isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-content">
        <div className="logo">
          <span className="text-gradient">Lagos</span>Ride
        </div>
        <nav className="nav-links">
          <a href="#ride" className="nav-link">Ride</a>
          <a href="#drive" className="nav-link">Drive</a>
          <a href="#business" className="nav-link">Business</a>
        </nav>
        <div className="header-actions">
          {session ? (
            <UserDropdown user={session.user} />
          ) : (
            <>
              <Button variant="ghost" onClick={() => signIn('google')}>Log in</Button>
              <Button variant="primary" onClick={() => signIn('google')}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
