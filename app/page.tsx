"use client";
import "@ant-design/v5-patch-for-react-19";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();
  return (
    <div style={{width: '100%', background: 'white', position: 'relative'}}>
      <Header isLoggedIn={false} />

      {/* Hero Image */}
      <div style={{width: '100%', height: 866}}>
        <img 
          style={{width: '100%', height: '100%', objectFit: 'cover'}} 
          src="/DALL·E 2025-03-10 12.48.34 - A breathtaking road trip scene featuring a winding highway through stunning landscapes. The road stretches through towering mountains, vast deserts, a 1.png" 
          alt="Road trip landscape"
        />
      </div>
      
      {/* Main Content */}
      <div style={{padding: '40px 20px'}}>
        {/* Main Heading */}
        <div style={{textAlign: 'center', color: 'black', fontSize: 32, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word', margin: '20px 0'}}>
          Map Mates – Your Ultimate Road Trip Companion 🚗🗺️
        </div>
        
        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '40px', margin: '40px 0'}}>
          {/* Intro Section */}
          <div style={{flex: '1', minWidth: '300px'}}>
            <div style={{color: 'black', fontSize: 20, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word', marginBottom: '20px'}}>
              Hit the Road with Confidence & Adventure!
            </div>
            <div style={{color: 'black', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word'}}>
              Planning a road trip? Whether you&#39;re chasing sunsets, exploring hidden gems, or embarking on the ultimate cross-country adventure, Map Mates is here to make your journey seamless, fun, and unforgettable!
            </div>
          </div>
          
          {/* Features Section */}
          <div style={{flex: '1', minWidth: '300px'}}>
            <div style={{color: 'black', fontSize: 20, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word', marginBottom: '20px'}}>
              Why Choose Map Mates?
            </div>
            <div style={{color: 'black', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word'}}>
              ✅ Smart Route Planning – Get the best routes with real-time traffic updates and scenic detours.<br/>
              ✅ Find Hidden Gems – Discover unique spots, quirky roadside attractions, and must-visit local favorites.<br/>
              ✅ Share the Ride – Plan trips with friends, share itineraries, and track each other&#39;s locations.<br/>
              ✅ Budget & Fuel Tracking – Stay on top of expenses, split costs, and find the cheapest gas stations.<br/>
              ✅ Offline Navigation – No signal? No problem. Download maps and keep moving.
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div style={{margin: '60px 0'}}>
          <div style={{color: 'black', fontSize: 20, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word', marginBottom: '20px'}}>
            Ready to Make Memories on the Road?
          </div>
          <div style={{color: 'black', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word', marginBottom: '20px'}}>
            Download Map Mates today and turn every drive into an epic adventure!<br/>
            📍 Explore More. 🚙 Drive Smarter. 🗺️ Adventure Awaits.
          </div>
          <div 
            style={{display: 'inline-flex', padding: '16px 20px', background: 'black', borderRadius: 3, justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}}
            onClick={() => router.push("/register")}
          >
            <div style={{color: 'white', fontSize: 20, fontFamily: 'Manrope', fontWeight: '700', wordWrap: 'break-word'}}>Get Started !</div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer style={{padding: '40px 20px', borderTop: '1.5px solid #090909'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px'}}>
          <div style={{color: '#090909', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', lineHeight: '24px', wordWrap: 'break-word'}}>
            AGB <br/>IMPRESSUM<br/>DATENSCHUTZ
          </div>
          <div style={{color: '#090909', fontSize: 14, fontFamily: 'Manrope', fontWeight: '700', lineHeight: '24px', wordWrap: 'break-word'}}>
            INSTAGRAM<br/>TELEGRAM<br/>NEWSLETTER
          </div>
        </div>
      </footer>
    </div>
  );
}
