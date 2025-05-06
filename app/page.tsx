"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import "@/styles/landing.css";

export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const featuresRef = useRef<HTMLElement | null>(null);

  // Features data
  const features = [
    {
      icon: "/map-elements/point_marker.svg",
      title: "Points of Interest",
      description: "Mark and discover interesting locations along your route. Share exciting destinations with your roadtrip companions."
    },
    {
      icon: "/map-elements/wayfinder.svg",
      title: "Route Planning",
      description: "Create routes between your favorite points of interest with options for driving, cycling, and walking."
    },
    {
      icon: "/map-elements/checklist.svg",
      title: "Collaborative Checklists",
      description: "Never forget essential items with shared checklists. Assign tasks to different trip members and track completion."
    },
    {
      icon: "/map-elements/layer-manager.svg",
      title: "Member Management",
      description: "Invite friends to join your roadtrip planning. Collaborate on decisions about where to go and what to see."
    }
  ];

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Adventure Enthusiast",
      image: "/default_user.png",
      text: "Tripster made it easy to mark all the places we wanted to visit on our road trip. Being able to collaborate with friends on the same map was a game-changer!"
    },
    {
      id: 2,
      name: "Sarah Miller",
      role: "Travel Blogger",
      image: "/default_user.png",
      text: "I love how I can create routes between different points of interest and choose between driving, cycling, or walking. Perfect for planning my travel content!"
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Family Traveler",
      image: "/default_user.png",
      text: "The checklist feature ensures we never forget anything important. Being able to assign items to different family members makes trip preparation so much easier."
    }
  ];
  
  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Scroll to features section
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{width: '100%', background: 'white', position: 'relative'}}>
      <Header />

      {/* Hero Section */}
      <section className="hero-container">
        <div 
          className="parallax-bg"
          style={{ 
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: 1 - scrollY * 0.001
          }}
        >
          <Image 
            className="hero-image"
            src="/DALL·E 2025-03-10 12.48.34 - A breathtaking road trip scene featuring a winding highway through stunning landscapes. The road stretches through towering mountains, vast deserts, a 1.png" 
            alt="Road trip landscape"
            width={1920}
            height={866}
            priority
          />
          
          {/* Animated Map Pins */}
          <div className="map-pin" style={{ left: '30%', top: '40%' }}>
            <div className="pin-pulse"></div>
          </div>
          
          <div className="map-pin" style={{ left: '60%', top: '35%' }}>
            <div className="pin-pulse"></div>
          </div>
          
          <div className="map-pin" style={{ left: '75%', top: '50%' }}>
            <div className="pin-pulse"></div>
          </div>
          
          {/* Animated Route Path */}
          <div className="route-path">
            <svg width="100%" height="100%" viewBox="0 0 1920 866">
              <path 
                d="M576,366 C750,350 950,323 1152,323 C1300,323 1380,400 1440,453" 
                stroke="#ffffff" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray="15,15"
                style={{
                  strokeDashoffset: scrollY * 0.5,
                  transition: "stroke-dashoffset 0.1s ease"
                }}
              />
            </svg>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in">
            Your Journey, <br/>
            <span className="highlight animate-fade-in delay-200">Reimagined</span>
          </h1>
          
          <p className="hero-subtitle animate-fade-in delay-300">
            Plan, explore, and share unforgettable road trips with friends
          </p>
          
          <div className="hero-cta animate-fade-in delay-400">
            <button 
              className="cta-button"
              onClick={() => router.push("/register")}
            >
              Start Your Adventure
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section" ref={featuresRef}>
        <h2 className="section-title animate-fade-in">
          Why Choose Tripster?
        </h2>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="feature-icon">
                <Image 
                  src={feature.icon} 
                  alt={feature.title} 
                  width={40} 
                  height={40}
                  style={feature.title === "Points of Interest" ? { filter: "brightness(0) invert(1)" } : undefined}
                />
              </div>
              
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              
              <div className="feature-hover-effect" />
            </div>
          ))}
        </div>
      </section>
      
      {/* Map Showcase Section */}
      <section className="map-showcase">
        <h2 className="section-title animate-fade-in">
          Plan Your Journey
        </h2>
        
        <div className="map-container animate-fade-in delay-200">
          <Image 
            className="map-image"
            src="/DALL·E 2025-03-10 12.48.34 - A breathtaking road trip scene featuring a winding highway through stunning landscapes. The road stretches through towering mountains, vast deserts, a 1.png" 
            alt="Interactive Map"
            width={1920}
            height={866}
          />
          
          <div className="map-overlay">
            <h3 className="map-title">Interactive Maps</h3>
            <p className="map-description">
              Mark points of interest, create routes between them, and collaborate with friends on your next adventure.
            </p>
          </div>
          
          {/* Map Feature Icons */}
          <div className="map-feature animate-fade-in delay-300" style={{ top: '15%', left: '20%' }}>
            <div className="map-feature-icon">
              <Image 
                src="/map-elements/point_marker.svg" 
                alt="POI" 
                width={30} 
                height={30}
                style={{ filter: "brightness(0) invert(1)" }} // Makes the SVG white
              />
            </div>
            <div className="map-feature-label">Points of Interest</div>
          </div>
          
          <div className="map-feature animate-fade-in delay-400" style={{ top: '75%', left: '60%' }}>
            <div className="map-feature-icon">
              <Image 
                src="/map-elements/wayfinder.svg" 
                alt="Route" 
                width={30} 
                height={30}
                style={{ filter: "brightness(0) invert(1)" }} // Makes the SVG white
              />
            </div>
            <div className="map-feature-label">Route Planning</div>
          </div>
          
          <div className="map-feature animate-fade-in delay-500" style={{ top: '85%', left: '30%' }}>
            <div className="map-feature-icon">
              <Image 
                src="/map-elements/checklist.svg" 
                alt="Checklist" 
                width={30} 
                height={30}
                style={{ filter: "brightness(0) invert(1)" }} // Makes the SVG white
              />
            </div>
            <div className="map-feature-label">Checklists</div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="testimonial-section">
        <h2 className="section-title animate-fade-in">
          What Our Travelers Say
        </h2>
        
        <div className="testimonial-carousel">
          <div className="testimonial-card animate-fade-in delay-200">
            <div className="quote-mark">&ldquo;</div>
            <p className="testimonial-text">{testimonials[currentTestimonial].text}</p>
            <div className="testimonial-author">
              <div className="author-image">
                <Image 
                  src={testimonials[currentTestimonial].image} 
                  alt={testimonials[currentTestimonial].name}
                  width={50}
                  height={50}
                  className="rounded-image"
                />
              </div>
              <div className="author-info">
                <h4>{testimonials[currentTestimonial].name}</h4>
                <p>{testimonials[currentTestimonial].role}</p>
              </div>
            </div>
          </div>
          
          <div className="carousel-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <Image 
            src="/DALL·E 2025-03-10 12.48.34 - A breathtaking road trip scene featuring a winding highway through stunning landscapes. The road stretches through towering mountains, vast deserts, a 1.png" 
            alt="Road trip background"
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="cta-overlay" />
        </div>
        
        <div className="cta-content">
          <h2 className="animate-fade-in">Ready to Plan Your Next Adventure?</h2>
          <p className="animate-fade-in delay-200">
            Create routes, mark points of interest, and collaborate with friends on your next road trip.
          </p>
          
          <div className="cta-buttons">
            <button 
              className="primary-button animate-fade-in delay-300"
              onClick={() => router.push("/register")}
            >
              Get Started Now
            </button>
            
            <button 
              className="secondary-button animate-fade-in delay-400"
              onClick={scrollToFeatures}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            AGB <br/>IMPRESSUM<br/>DATENSCHUTZ
          </div>
          <div className="footer-column">
            INSTAGRAM<br/>TELEGRAM<br/>NEWSLETTER
          </div>
        </div>
      </footer>
    </div>
  );
}
