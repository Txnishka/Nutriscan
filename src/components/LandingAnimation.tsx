import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./LandingAnimation.css"; // Include custom CSS

interface LandingAnimationProps {
    onFinish: () => void;
}

// Define animation durations in milliseconds
const dropDuration = 1000; // Duration for the drop animation
const zoomDuration = 1500; // Duration for the zoom animation
// Removed revealDuration and buffer as they are no longer needed for an explicit phase

export default function LandingAnimation({ onFinish }: LandingAnimationProps) {
  const [phase, setPhase] = useState("drop");

  // Preload the nutrition label image
  useEffect(() => {
    const img = new Image();
    img.src = "/label.jpg"; // Use the correct image path from public directory
  }, []); // Run once on mount

  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];

    // Schedule phase changes: drop -> zoom -> immediately call onFinish
    timers.push(setTimeout(() => setPhase("zoom"), dropDuration)); // Change phase to zoom after drop duration
    // Call onFinish immediately after the zoom duration ends
    timers.push(setTimeout(onFinish, dropDuration + zoomDuration)); 

    // Cleanup all timers on component unmount
    return () => {
        timers.forEach(timer => clearTimeout(timer));
    };

  }, [onFinish]);

  // Determine background image based on phase
  // Show nutrition label during drop and zoom, component will unmount after zoom
  const backgroundImage = (phase === "drop" || phase === "zoom") ? '/label.jpg' : 'none'; // Use correct image path

  return (
    <div className="animation-wrapper"> {/* Removed conditional reveal class */} 
      <motion.div
        className="animated-box"
        initial={{ y: "-100vh", opacity: 0, scale: 1 }}
        animate={{
          y: phase === "drop" ? "0vh" : 0,
          opacity: 1, // Keep opacity at 1 during drop and zoom
          scale: phase === "zoom" ? 1.5 : 1, // Zoom in
          transition: {
            y: { type: "spring", stiffness: 120, damping: 20, duration: dropDuration / 1000 },
            opacity: { duration: 0 }, // Instant opacity change (no fade out within the component)
            scale: { duration: zoomDuration / 1000, ease: "easeOut" },
          },
        }}
        style={{ backgroundImage: `url(${backgroundImage})` }} // Set background image dynamically
      >
        {/* No child elements needed */} 
      </motion.div>
    </div>
  );
} 