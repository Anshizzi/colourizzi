import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-purpleBase">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute left-[10%] top-[20%] w-[40vw] h-[40vw] bg-orangeCamlin rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute right-[10%] bottom-[20%] w-[50vw] h-[50vw] bg-goldHighlight rounded-full blur-[120px] opacity-20"></div>
      </div>

      {/* Centered content with proper constraints */}
      <div className="w-full max-w-6xl mx-auto px-4 text-center">
        <motion.h1 
          className="text-white text-6xl md:text-8xl lg:text-9xl font-heading tracking-wide"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white">COLOUR</span>
          <span className="text-goldHighlight">IZZI</span>
        </motion.h1>
      </div>
    </section>
  );
};

export default Hero;