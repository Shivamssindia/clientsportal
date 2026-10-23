import { useAuth } from '@/contexts/AuthContext';
import React from 'react'

const Hero = () => {
  const { isAuthenticated, loading, user } = useAuth();
  
  return (
    <>
        {/* <!-- =================== HERO =================== --> */}
<section id="home" className="hero">
  <div className="hero-video-wrap">
    <video className="hero-video" autoPlay loop muted playsInline>
      <source src="video/203295-920603022_medium.mp4" type="video/mp4"/>
    </video>
  </div>
  <div className="hero-overlay"></div>
  <div className="hero-body">
    <div className="hero-badge"><span className="bp"></span> SoftMax — AI-Powered Digital Systems</div>
    <h1>Build <span className="g1">Smarter</span><br/><span className="g2">Scale Faster</span></h1>
    <p className="hero-desc">{user?.name && <><span style={{fontSize : "20px"}}>W</span>elcome {user?.name}. </>}SoftMax Technologies & IT Services delivers high-velocity, scalable digital systems engineered to perform under pressure. We solve business problems with AI and modern technology — improving ROI, automating workflows, and delivering measurable outcomes.</p>
    <div className="hero-btns">
      <a className="btn-prim" href='#services'>
        <i className="fas fa-rocket"></i> Explore Solutions
      </a>
      {user ? (
        <a className="btn-ghost" href='/dashboard'>
          <img src={`${user.photoUrl}`} className='w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-blue-500' alt="profile photo" /> Console
        </a>
      ) : (
        <button className="btn-ghost" onClick={() => window.triggerGoogleLogin?.()}>
          <i className="fas fa-user"></i> Get Started
        </button>
      )}
    </div>
    <div className="hero-stats">
      <div><div className="h-snum">99%</div><div className="h-slbl">Business Problems AI Can Solve</div></div>
      <div><div className="h-snum">Sub-Second</div><div className="h-slbl">Response Times</div></div>
      <div><div className="h-snum">3.4×</div><div className="h-slbl">Average Client ROI</div></div>
      <div><div className="h-snum">24/7</div><div className="h-slbl">Transparent Tracking</div></div>
    </div>
  </div>
  <div className="scroll-ind"><span>Scroll</span><div className="scroll-line"></div></div>
</section>
    </>
  )
}

export default Hero