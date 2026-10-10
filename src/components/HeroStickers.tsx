"use client";

import { motion, Variants } from "framer-motion";
import Sticker from "./Sticker";

interface HeroStickersProps {
  variant?: "top-right" | "bottom-left";
}

const peelVariants: Variants = {
  hidden: (custom: { rotation: number }) => ({
    opacity: 0,
    scale: 0.5,
    y: 50,
    rotate: custom.rotation - 30, // Peel in with a dramatic rotation
    filter: "blur(10px)",
  }),
  visible: (custom: { delay: number; rotation: number }) => ({
    opacity: 1, // Full proper image visibility as requested
    scale: 1,
    y: 0,
    rotate: custom.rotation,
    filter: "blur(0px)",
    transition: {
      delay: custom.delay,
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 1.2,
    },
  }),
};

export default function HeroStickers({ variant = "top-right" }: HeroStickersProps) {
  const stickerData = variant === "top-right" 
    ? {
        id: "vcr",
        src: "/stickers/black-white-vintage-vcr-sticke.png", // Retro VCR
        alt: "Retro VCR",
        // Responsive placement: Exactly located at the top-right corner, angled down like a corner camera
        className: "top-[-2%] right-[-2%] md:top-[-40%] md:right-[-1%] w-24 md:w-32 lg:w-48 z-30 origin-top-right",
        delay: 0.6,
        baseRotation: -20, // Angled downwards into the room/frame
        shadowClass: "drop-shadow-[-10px_15px_15px_rgba(0,0,0,0.4)]",
      }
    : {
        id: "dago",
        src: "/stickers/dago.png", // Dago sticker
        alt: "Dago Sticker",
        // Responsive placement: Exactly located at the bottom-left corner, angled up like a reverse camera
        className: "bottom-[0%] left-[0%] md:bottom-[-5%] md:left-[-5%] lg:bottom-[-20%] lg:left-[-80%] w-20 md:w-28 lg:w-49 z-30 origin-bottom-left lg:top-[60%]",
        delay: 1.2, // Slightly delayed after the first sticker
        baseRotation: -10, // Angled upwards into the room/frame
        shadowClass: "drop-shadow-[10px_-15px_15px_rgba(0,0,0,0.4)]", // Shadow points up-right
      };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 dark:hidden">
      <motion.div
        key={stickerData.id}
        custom={{ delay: stickerData.delay, rotation: stickerData.baseRotation }}
          variants={peelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`absolute ${stickerData.className}`}
          style={{ willChange: "transform, opacity, filter" }}
        >
          <motion.div
            animate={{ 
              y: [0, -12, 0], 
              rotate: [stickerData.baseRotation, stickerData.baseRotation + 3, stickerData.baseRotation] 
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity, 
              ease: "easeInOut",
              delay: stickerData.delay + 1, // Start idle float AFTER peel reveal
            }}
            className="w-full h-full transform-gpu"
          >
            <Sticker
              src={stickerData.src}
              alt={stickerData.alt}
              // Dynamic heavy focused drop shadow simulating corner lighting
              imageClassName={stickerData.shadowClass}
              forceTransparentBlend={true}
            />
          </motion.div>
        </motion.div>
    </div>
  );
}
