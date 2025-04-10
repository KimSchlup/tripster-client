"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import useLocalStorage from "@/hooks/useLocalStorage";

type SidebarMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn?: boolean;
};

export default function SidebarMenu({ isOpen, onClose, isLoggedIn = false }: SidebarMenuProps) {
  const router = useRouter();
  const apiService = useApi();
  const { set: setToken } = useLocalStorage<string>("token", "");
  const { set: setUserId } = useLocalStorage<string>("userId", "");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handleItemClick = async (route: string, itemName: string) => {
    setClickedItem(itemName);
    
    // Handle logout separately
    if (isLoggedIn && itemName === 'logout') {
      try {
        // Send POST request to logout endpoint
        await apiService.post('/auth/logout', {});
        
        // Clear authentication data
        setToken("");
        setUserId("");
        
        // Redirect to home page
        setTimeout(() => {
          router.push('/');
          onClose();
        }, 300);
      } catch (error) {
        console.error('Logout failed:', error);
        // Still redirect to home page even if logout request fails
        setTimeout(() => {
          router.push('/');
          onClose();
        }, 300);
      }
    } else {
      // Normal navigation for other menu items
      setTimeout(() => {
        router.push(route);
        onClose();
      }, 300); // Add a small delay for the click effect
    }
  };

  // Get text color based on item state
  const getTextColor = (itemName: string) => {
    if (clickedItem === itemName) {
      return 'black';
    } else if (hoveredItem === itemName) {
      return 'rgba(0, 0, 0, 0.60)';
    } else {
      return 'rgba(0, 0, 0, 0.30)';
    }
  };

  // Get icon opacity based on item state
  const getIconOpacity = (itemName: string) => {
    if (clickedItem === itemName) {
      return 1;
    } else if (hoveredItem === itemName) {
      return 0.6;
    } else {
      return 0.3;
    }
  };

  // Handle click on the overlay background (outside the sidebar)
  const handleOverlayClick = (event: React.MouseEvent) => {
    // Only close if the click is directly on the overlay, not on the sidebar content
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="sidebar-menu" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 2000,
        display: 'flex'
      }}
      onClick={handleOverlayClick}
    >
      <div style={{
        width: 374,
        height: '100%',
        position: 'relative',
        background: 'white',
        overflow: 'hidden'
      }}>
        {/* Burger menu (close button) */}
        <div 
          data-clicked="Clicked" 
          data-state="Default" 
          style={{
            width: 36, 
            height: 36, 
            left: 24, 
            top: 53, 
            position: 'absolute', 
            background: 'white', 
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={onClose}
        >
          <div style={{width: 36, height: 36, left: 0, top: 0, position: 'absolute', overflow: 'hidden'}}>
            <div style={{width: 36, height: 6.80, left: 0, top: 29.20, position: 'absolute', background: "rgba(0, 0, 0, 0.20)"}} />
            <div style={{width: 36, height: 6.80, left: 0, top: 14.60, position: 'absolute', background: "rgba(0, 0, 0, 0.20)"}} />
            <div style={{width: 36, height: 6.80, left: 0, top: 0, position: 'absolute', background: "rgba(0, 0, 0, 0.20)"}} />
          </div>
        </div>

        {/* Menu Items Container */}
        <div style={{
          width: 374,
          left: 0,
          top: 141,
          position: 'absolute',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          display: 'inline-flex'
        }}>
          {/* My Roadtrips
          */}
          <div 
            style={{
              alignSelf: 'stretch',
              height: 84,
              position: 'relative',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              display: 'inline-flex'
            }}
          >
            <div 
              data-property-2="Property 23" 
              data-state="Default" 
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                display: 'flex'
              }}
              onClick={() => handleItemClick('/my-roadtrips', 'roadtrips')}
              onMouseEnter={() => setHoveredItem('roadtrips')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div 
                data-state="Default" 
                style={{
                  width: 374,
                  height: 84,
                  padding: 20,
                  position: 'relative',
                  background: '#D9D9D9',
                  borderRadius: 3,
                  outline: '1px rgba(0, 0, 0, 0.20) solid',
                  outlineOffset: '-1px',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  display: 'flex',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 252,
                  height: 83,
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: getTextColor('roadtrips'),
                  fontSize: 20,
                  fontFamily: 'Manrope',
                  fontWeight: '700',
                  wordWrap: 'break-word',
                  transition: 'color 0.2s ease',
                  paddingLeft: 35 // Add padding to prevent overlap with the icon
                }}>My Roadtrips</div>
              </div>
            </div>
            <div data-color="Default" data-type="Map" style={{
              width: 35,
              height: 35,
              left: 17,
              top: 24,
              position: 'absolute',
              opacity: getIconOpacity('roadtrips'),
              transition: 'opacity 0.2s ease'
            }}>
              <Image 
                src="/icons8-karte-100.png" 
                alt="Map Icon" 
                width={33} 
                height={33} 
                style={{left: 1, top: 2.50, position: 'absolute'}} 
              />
            </div>
          </div>

          {/* My Profile - Original style */}
          <div 
            style={{
              width: '100%', 
              height: 84, 
              padding: 20, 
              background: '#D9D9D9', 
              borderRadius: 3, 
              outline: '1px rgba(0, 0, 0, 0.20) solid', 
              outlineOffset: '-1px', 
              justifyContent: 'flex-start', 
              alignItems: 'center', 
              display: 'flex',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onClick={() => handleItemClick('/profile', 'profile')}
            onMouseEnter={() => setHoveredItem('profile')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div data-color="Default" data-type="Profile" style={{
              width: 35, 
              height: 35, 
              position: 'relative', 
              opacity: getIconOpacity('profile'),
              transition: 'opacity 0.2s ease'
            }}>
              <Image 
                src="/icons8-vertragsarbeit-96.png" 
                alt="Profile Icon" 
                width={33} 
                height={33}
                style={{left: 1, top: 1.50, position: 'absolute'}}
              />
            </div>
            <div style={{
              width: 252, 
              height: 83, 
              justifyContent: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              color: getTextColor('profile'), 
              fontSize: 20, 
              fontFamily: 'Manrope', 
              fontWeight: '700', 
              wordWrap: 'break-word',
              transition: 'color 0.2s ease'
            }}>My Profile</div>
          </div>

          {/* Register/Logout - Changes based on login status */}
          <div 
            data-property-1="Default" 
            style={{
              width: '100%', 
              height: 84, 
              padding: 20, 
              background: '#D9D9D9', 
              borderRadius: 3, 
              outline: '1px rgba(0, 0, 0, 0.20) solid', 
              outlineOffset: '-1px', 
              justifyContent: 'flex-start', 
              alignItems: 'center', 
              display: 'flex',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onClick={() => handleItemClick(isLoggedIn ? '/' : '/register', isLoggedIn ? 'logout' : 'register')}
            onMouseEnter={() => setHoveredItem(isLoggedIn ? 'logout' : 'register')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div data-color="Default" data-type={isLoggedIn ? "Logout" : "Sign Up"} style={{
              width: 35, 
              height: 35, 
              position: 'relative', 
              opacity: getIconOpacity(isLoggedIn ? 'logout' : 'register'),
              transition: 'opacity 0.2s ease'
            }}>
              <Image 
                src="/icons8-vertragsarbeit-96.png" 
                alt={isLoggedIn ? "Logout Icon" : "Register Icon"} 
                width={33} 
                height={33} 
                style={{left: 1, top: 1.50, position: 'absolute'}} 
              />
            </div>
            <div style={{
              width: 252, 
              height: 83, 
              justifyContent: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              color: getTextColor(isLoggedIn ? 'logout' : 'register'), 
              fontSize: 20, 
              fontFamily: 'Manrope', 
              fontWeight: '700', 
              wordWrap: 'break-word',
              transition: 'color 0.2s ease'
            }}>{isLoggedIn ? 'Logout' : 'Register'}</div>
          </div>

          {/* Login - Only shown when not logged in */}
          {!isLoggedIn && (
            <div 
              data-property-1="Default" 
              style={{
                width: '100%', 
                height: 84, 
                padding: 20, 
                background: '#D9D9D9', 
                borderRadius: 3, 
                outline: '1px rgba(0, 0, 0, 0.20) solid', 
                outlineOffset: '-1px', 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                display: 'flex',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onClick={() => handleItemClick('/login', 'login')}
              onMouseEnter={() => setHoveredItem('login')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div data-color="Default" data-type="Login" style={{
                width: 35, 
                height: 35, 
                position: 'relative', 
                opacity: getIconOpacity('login'),
                transition: 'opacity 0.2s ease'
              }}>
                <Image 
                  src="/login.png" 
                  alt="Login Icon" 
                  width={34} 
                  height={34} 
                  style={{left: 0, top: 1, position: 'absolute'}} 
                />
              </div>
              <div style={{
                width: 252, 
                height: 83, 
                justifyContent: 'center', 
                display: 'flex', 
                flexDirection: 'column', 
                color: getTextColor('login'), 
                fontSize: 20, 
                fontFamily: 'Manrope', 
                fontWeight: '700', 
                wordWrap: 'break-word',
                transition: 'color 0.2s ease'
              }}>Login</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
