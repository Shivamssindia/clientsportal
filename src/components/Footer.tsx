"use client";

import React, { useState } from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      alert("Please enter a valid email");
      return;
    }
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <footer>
  <div className="footer-inner">
    <div className="footer-grid">
      <div>
        <div className="f-brand-name"><div className="logo-mk" style={{width:'32px',height:'32px',fontSize:'.85rem',borderRadius:'8px',}}><img src="img/logo.png" alt=""/></div><span className="logo-gb">SoftMax</span>&nbsp;Technologies</div>
        <p className="footer-p">High-velocity, scalable digital systems engineered to perform under pressure. Zero technical anxiety. Measurable business ROI.</p>
        <div className="f-soc">
          <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
        </div>
      </div>
      <div className="footer-col"><h5>Company</h5><ul><li><a href="#about">About Us</a></li><li><a href="#team">Our Team</a></li><li><a href="#">Case Studies</a></li><li><a href="#">Careers</a></li></ul></div>
      <div className="footer-col"><h5>Solutions</h5><ul><li><a href="#services">Industries</a></li><li><a href="#how">For Businesses</a></li><li><a href="#how">For Consultants</a></li><li><a href="#">Client Portal</a></li></ul></div>
      <div className="footer-col">
        <h5>Stay Updated</h5>
        <p className="nl-sub">Get insights on AI-driven software and business ROI.</p>
        <div className="nl-form"><input type="email" placeholder="your@email.com" id="nlEmail"/><button onClick={()=>{handleSubscribe()}}>Subscribe</button></div>
        <p className="muted" style={{fontSize:'.7rem', marginTop:'.45rem'}}>No spam. Unsubscribe anytime.</p>
        <div className="f-contact">
          <span><i className="fas fa-globe"></i>clients.softmax.in</span>
          <span><i className="fas fa-envelope"></i>support.softmax@gmail.com</span>
          <span><i className="fas fa-envelope"></i>softmaxdigitals@gmail.com</span>
        </div>
      </div>
    </div>
    <div className="footer-btm">
      <p>© 2026 SoftMax Technologies & IT Services. All rights reserved.</p>
      <div className="footer-btm-links"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Cookie Policy</a><a href="#">Accessibility</a></div>
    </div>
  </div>
</footer>
  );
};

export default Footer;











// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// const Footer: React.FC = () => {
//   const [email, setEmail] = useState("");

//   const handleSubscribe = () => {
//     if (!email) {
//       alert("Please enter a valid email");
//       return;
//     }
//     console.log("Subscribed:", email);
//     setEmail("");
//   };

//   return (
//     <footer>
//   <div className="footer-inner">
//     <div className="footer-grid">
//       <div>
//         <div className="f-brand-name"><div className="logo-mk" style={{width:'32px',height:'32px',fontSize:'.85rem',borderRadius:'8px',}}><img src="img/logo.png" alt=""/></div><span className="logo-gb">Gaurion</span>&nbsp;Bharat</div>
//         <p className="footer-p">Making Talent Visible, Delivering Measurable Impact. India's most intelligent Public-Private Partnership consulting platform.</p>
//         <div className="f-soc">
//           <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
//           <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
//           <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
//           <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
//           <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
//         </div>
//       </div>
//       <div className="footer-col"><h5>Company</h5><ul><li><a href="#about">About Us</a></li><li><a href="#team">Our Team</a></li><li><a href="#">Case Studies</a></li><li><a href="#">Newsroom</a></li><li><a href="#">Careers</a></li></ul></div>
//       <div className="footer-col"><h5>Platform</h5><ul><li><a href="#services">Services</a></li><li><a href="#how">For Companies</a></li><li><a href="#how">For Consultants</a></li><li><a href="#pricing">Pricing</a></li><li><a href="#">API Docs</a></li></ul></div>
//       <div className="footer-col">
//         <h5>Stay Updated</h5>
//         <p className="nl-sub">Get the latest insights on AI-driven consulting and PPP innovations.</p>
//         <div className="nl-form"><input type="email" placeholder="your@email.com" id="nlEmail"/><button onClick={()=>{handleSubscribe()}}>Subscribe</button></div>
//         <p className="muted" style={{fontSize:'.7rem', marginTop:'.45rem'}}>No spam. Unsubscribe anytime.</p>
//         <div className="f-contact">
//           <span><i className="fas fa-map-marker-alt"></i>Bhopal, Madhya Pradesh, India</span>
//           <span><i className="fas fa-envelope"></i>gaurionbharat@gmail.com</span>
//           <span><i className="fas fa-phone-alt"></i>+91 9425970955</span>
//         </div>
//       </div>
//     </div>
//     <div className="footer-btm">
//       <p>© 2026 Gaurion Bharat Private Limited. All rights reserved.</p>
//       <div className="footer-btm-links"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Cookie Policy</a><a href="#">Accessibility</a></div>
//     </div>
//   </div>
// </footer>
//   );
// };

// export default Footer;