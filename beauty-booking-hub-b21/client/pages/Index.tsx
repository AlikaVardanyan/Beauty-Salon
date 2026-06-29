import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Masters from "@/components/sections/Masters";
import BookingForm from "@/components/sections/BookingForm";
import Reviews from "@/components/sections/Reviews";
import Contacts from "@/components/sections/Contacts";
import { motion, useScroll, useSpring } from "framer-motion";

export default function Index() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Layout>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <main>
        <Hero />
        <div id="services" className="scroll-mt-20">
          <Services />
        </div>

        <Masters />
        <div id="booking" className="scroll-mt-24">
          <BookingForm />
        </div>

        <Reviews />
        
        <div id="contacts" className="scroll-mt-20">
          <Contacts />
        </div>
      </main>
    </Layout>
  );
}