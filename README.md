# Lagos Ride App

A futuristic ride-hailing application for Lagos, built with Next.js.

## Features
- **Futuristic UI:** Neon aesthetics, glassmorphism, and smooth animations.
- **LocationIQ Autocomplete:** Real-time location search for Lagos, Nigeria.
- **Ride Request Flow:** Simulate requesting a ride with real-time status updates.
- **Google Authentication:** Secure login with Google OAuth.
- **Responsive Design:** Works seamlessly on desktop and mobile.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# LocationIQ API Configuration
# Get your free API key from: https://locationiq.com/
NEXT_PUBLIC_LOCATIONIQ_API_KEY=your_api_key_here

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

### 3. Get Your LocationIQ API Key

1. Go to [https://locationiq.com/](https://locationiq.com/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key
5. Paste it in `.env.local` as `NEXT_PUBLIC_LOCATIONIQ_API_KEY`

**Free Tier Includes:**
- 5,000 requests per day
- Autocomplete & Geocoding
- No credit card required

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure
- `app/`: Main application code (pages, layouts, styles).
- `components/`: Reusable UI components (LocationInput, RideCard, RideStatus, etc.).
- `data/`: Static data files (Lagos locations fallback).
- `public/`: Static assets.

## API Integration

### LocationIQ Autocomplete
The app uses LocationIQ's autocomplete API to provide real-time location suggestions as users type. The component:
- Debounces requests (300ms delay)
- Filters results to Lagos, Nigeria
- Falls back gracefully if API key is missing
- Displays loading states and suggestions

## Build for Production

```bash
npm run build
npm start
```
