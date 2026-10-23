// "use client";
// import Banner from "@/components/Banner";
// import React, { useEffect } from "react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import Hero from "@/components/Hero";
// import Tecket from "@/components/Tecket";
// import About from "@/components/About";
// import Metrics from "@/components/Metrics";
// import Services from "@/components/Services";
// import HowItWorks from "@/components/HowItWorks";
// import Testimonials from "@/components/Testimonials";
// import Team from "@/components/Team";
// import Cta from "@/components/Cta";
// import Ttb from "@/components/Ttb";
// import ModalClient from "@/components/ModalClient";
// import { useAuth } from "@/contexts/AuthContext";
// import ModalConsult from "@/components/ModelConsult";
// import Head from "next/head";

// export default function Home() {
//   const { user } = useAuth();

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", "light");

//     (window as any).smoothTo = (id: string) =>
//       document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

//     document.querySelectorAll('a[href^="#"]').forEach(a => {
//       a.addEventListener('click', (e: Event) => {
//         const id = (a.getAttribute('href') as string).slice(1);
//         if (id && document.getElementById(id)) {
//           e.preventDefault();
//           (window as any).smoothTo(id);
//           closeMob();
//         }
//       });
//     });

//     const ham = document.getElementById('ham') as HTMLElement,
//       mob = document.getElementById('mobDrawer') as HTMLElement;
//     const closeMob = () => {
//       mob?.classList.remove('open');
//       ham?.classList.remove('open');
//     };
//     ham?.addEventListener('click', () => {
//       mob?.classList.toggle('open');
//       ham?.classList.toggle('open');
//     });
//     document.querySelectorAll('.mob-nl').forEach(a => a.addEventListener('click', closeMob));
//     document.addEventListener('click', (e: MouseEvent) => {
//       if (!mob?.contains(e.target as Node) && !ham?.contains(e.target as Node)) closeMob();
//     });

//     const faders = document.querySelectorAll<HTMLElement>(".fu");
//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("vis");
//             io.unobserve(entry.target);
//           }
//         });
//       },
//       { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
//     );
//     faders.forEach(f => io.observe(f));
//     const timeout = setTimeout(() => {
//       faders.forEach(f => {
//         if (f.getBoundingClientRect().top < window.innerHeight - 40) f.classList.add("vis");
//       });
//     }, 80);

//     return () => {
//       io.disconnect();
//       clearTimeout(timeout);
//     };
//   }, []);

//   return (
//     <>
//       <Head>
//         {/* Primary Title */}
//         <title>Business Consultant | MSME Consultant | Export Consultant | PPP Consultant in India – Gaurion Bharat Private Limited</title>
        
//         {/* Meta Description */}
//         <meta name="description" content="Gaurion Bharat Private Limited provides expert Business Consulting, MSME Advisory, Export Consulting, Public Private Partnership (PPP) Advisory, Industrial Projects, and Strategic Growth Solutions across India. Website developed by Softmax Technologies Indore." />
        
//         {/* Primary Keywords */}
//         <meta name="keywords" content="business consultant india, management consultant india, strategic business consultant, corporate consultant india, startup business consultant, sme business consultant, growth strategy consultant, business advisory services india, professional consulting firm india, industrial consultant india, business consultant delhi ncr, business consultant bhopal, business consultant indore, business consultant madhya pradesh, best business consultant in india" />
        
//         {/* MSME Keywords */}
//         <meta name="keywords" content="msme consultant india, msme registration consultant, msme advisory services, msme project consultant, msme funding consultant, msme government scheme consultant, msme loan consultant, udyam registration consultant, small business consultant india, msme growth consultant" />
        
//         {/* Export Keywords */}
//         <meta name="keywords" content="export consultant india, import export consultant, international trade consultant, export business consultant, export documentation consultant, dgft consultant india, export license consultant, export promotion consultant, global trade consultant, international business consultant" />
        
//         {/* PPP Keywords */}
//         <meta name="keywords" content="ppp consultant india, public private partnership consultant, infrastructure ppp consultant, government project consultant, public sector advisory india, ppp project advisory, infrastructure consulting services, smart city project consultant, policy advisory consultant india, government liaison consultant" />
        
//         {/* Investment & Industrial Keywords */}
//         <meta name="keywords" content="investment consultant india, industrial project consultant, project management consultant, business expansion consultant, make in india consultant, manufacturing consultant india, economic development consultant, market entry consultant india, business setup consultant india" />
        
//         {/* Long-Tail Keywords */}
//         <meta name="keywords" content="how to start export business in india, msme registration consultant near me, best export consultant in india, government scheme consultant for msme, ppp project consultant india, business setup advisory india, export documentation services india, industrial project consultancy services, international trade advisory services, startup and msme consultant india" />
        
//         {/* Softmax Technologies Credit */}
//         <meta name="developer" content="Softmax Technologies Indore" />
//         <meta name="website-developed-by" content="Softmax Technologies - https://softmax.in" />
        
//         {/* GSC Verification */}
//         <meta name="google-site-verification" content="dd920c83125058a9" />
        
//         {/* Canonical URL */}
//         <link rel="canonical" href="https://gaurion.in" />
        
//         {/* Open Graph / Social Media */}
//         <meta property="og:title" content="Business Consultant | MSME Consultant | Export Consultant | PPP Consultant in India – Gaurion Bharat" />
//         <meta property="og:description" content="Gaurion Bharat provides expert Business Consulting, MSME Advisory, Export Consulting, PPP Advisory, and Strategic Growth Solutions across India. Developed by Softmax Technologies Indore." />
//         <meta property="og:url" content="https://gaurion.in" />
//         <meta property="og:type" content="website" />
//         <meta property="og:site_name" content="Gaurion Bharat" />
        
//         {/* Twitter Card */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content="Gaurion Bharat - Best Business Consultant in India" />
//         <meta name="twitter:description" content="Expert MSME, Export & PPP Consulting Services across India. Website by Softmax Technologies Indore." />
        
//         {/* Robots */}
//         <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
//         <meta name="googlebot" content="index, follow" />
        
//         {/* Viewport */}
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
//         {/* Author */}
//         <meta name="author" content="Gaurion Bharat Private Limited" />
        
//         {/* Geo Tags for India */}
//         <meta name="geo.region" content="IN-MP" />
//         <meta name="geo.placename" content="Bhopal" />
//         <meta name="geo.position" content="23.2599;77.4126" />
//         <meta name="ICBM" content="23.2599, 77.4126" />
        
//         {/* Language */}
//         <meta http-equiv="content-language" content="en-in" />
//       </Head>
      
//       <div id="sp"></div>
//       <Navbar />
//       <Banner />
//       <Hero />
//       <Tecket />
//       <About />
//       <Metrics />
//       <Services />
//       <HowItWorks />
//       <Testimonials />
//       <Team />
//       <Cta />
//       <Ttb />
//       <ModalClient />
//       <ModalConsult />
//       <Footer />
//     </>
//   );
// }







"use client";
import Banner from "@/components/Banner";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Tecket from "@/components/Tecket";
import About from "@/components/About";
import Metrics from "@/components/Metrics";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import Pricing from "@/components/Pricing";
import Cta from "@/components/Cta";
import Ttb from "@/components/Ttb";
import ModalClient from "@/components/ModalClient";
import { useAuth } from "@/contexts/AuthContext";
import ModalConsult from "@/components/ModelConsult";
import ProjectInquiry from "@/components/ProjectInquiry";
import OurTechnologies from "@/components/dashboard/OurTechnologies";

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
   

    document.documentElement.setAttribute("data-theme", "light");

    // Smooth scroll
    (window as any).smoothTo = (id: string) =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e: Event) => {
        const id = (a.getAttribute('href') as string).slice(1);
        if (id && document.getElementById(id)) {
          e.preventDefault();
          (window as any).smoothTo(id);
          closeMob();
        }
      });
    });

    const ham = document.getElementById('ham') as HTMLElement,
      mob = document.getElementById('mobDrawer') as HTMLElement;
    const closeMob = () => {
      mob?.classList.remove('open');
      ham?.classList.remove('open');
    };
    ham?.addEventListener('click', () => {
      mob?.classList.toggle('open');
      ham?.classList.toggle('open');
    });
    document.querySelectorAll('.mob-nl').forEach(a => a.addEventListener('click', closeMob));
    document.addEventListener('click', (e: MouseEvent) => {
      if (!mob?.contains(e.target as Node) && !ham?.contains(e.target as Node)) closeMob();
    });

    const faders = document.querySelectorAll<HTMLElement>(".fu");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );
    faders.forEach(f => io.observe(f));
    const timeout = setTimeout(() => {
      faders.forEach(f => {
        if (f.getBoundingClientRect().top < window.innerHeight - 40) f.classList.add("vis");
      });
    }, 80);

    return () => {
      io.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <div id="sp"></div>
      <Navbar />
      <Banner />
      <Hero />
      <Tecket />
      <About />
      <ProjectInquiry />
      <Metrics />
      <Services />
      <HowItWorks />
      {/* <Testimonials /> */}
      {/* <Team /> */}
      {/* <Pricing /> */}
      <Cta />
      <Ttb />
     <OurTechnologies />
      {/* <ModalClient /> */}
      {/* <ModalConsult /> */}
      <Footer />
    </>
  );
}