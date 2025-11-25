import { motion } from "framer-motion";

const BreathingRedDot = () => {
  return (
    <div className="flex items-center justify-center  bg-transparent">
      <motion.div
        className="rounded-full"
        initial={{ scale: 0.6, opacity: 0.4 }}
        animate={{
          scale: [0.6, 1, 0.6],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: "rgba(255, 0, 0, 0.6)", // semi-transparent red
        }}
      />
    </div>
  );
};

export default BreathingRedDot;
