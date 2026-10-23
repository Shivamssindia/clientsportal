import React, { useEffect } from 'react'

const Testimonials = () => {
    useEffect(() => {
      try {
    let cur = 0;
    const track = document.getElementById('slTrack') as HTMLElement,
      dots = document.querySelectorAll<HTMLElement>('.sd'),
      total = dots.length;

    const goTo = (n: number) => {
      cur = (n + total) % total;
      if (track) track.style.transform = 'translateX(-' + cur * 100 + '%)';
      dots.forEach((d, i) => d.classList.toggle('on', i === cur));
    };

    document.getElementById('slPrev')?.addEventListener('click', () => goTo(cur - 1));
    document.getElementById('slNext')?.addEventListener('click', () => goTo(cur + 1));

    dots.forEach(d =>
      d.addEventListener('click', () => goTo(+(d.dataset.i as string)))
    );

    setInterval(() => goTo(cur + 1), 5500);

    let tx = 0;

    track?.addEventListener('touchstart', (e: TouchEvent) => {
      tx = e.touches[0].clientX;
    }, { passive: true });

    track?.addEventListener('touchend', (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) goTo(cur + (dx < 0 ? 1 : -1));
    });
      } catch (error) {
        
      }
    }, [])
    
    return (
        <>
            <section className="testi-sec">
                <div className="sec-inner sec-c">
                    <div className="sec-label fu"><i className="fas fa-star"></i> Testimonials</div>
                    <h2 className="sec-title fu d1">Trusted by Growing Businesses</h2>
                </div>
                <div className="slides-outer fu d2">
                    <button className="sl-arr sl-prev" id="slPrev"><i className="fas fa-chevron-left"></i></button>
                    <button className="sl-arr sl-next" id="slNext"><i className="fas fa-chevron-right"></i></button>
                    <div className="slides-track" id="slTrack">
                        <div className="slide"><div className="slide-card">
                            <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                            <p className="slide-txt">"SoftMax didn't just build us a booking system — they understood our patient flow first, then designed something that actually reduced wait times. The client portal meant we could see exactly what was happening at every stage. Zero anxiety, exactly as promised."</p>
                            <div className="slide-author"><div className="s-av" style={{ background: "var(--g-main)" }}>R</div><div><div className="s-name">Rajesh Mehta</div><div className="s-role">Operations Director, Healthcare Startup</div></div></div>
                        </div></div>
                        <div className="slide"><div className="slide-card">
                            <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                            <p className="slide-txt">"We came to SoftMax with a warehouse management problem that spreadsheets couldn't handle anymore. They delivered an AI-assisted system in weeks, not months. The transparency throughout the project was genuinely refreshing."</p>
                            <div className="slide-author"><div className="s-av" style={{ background: "var(--g-warm)" }}>P</div><div><div className="s-name">Priya Nair</div><div className="s-role">Supply Chain Lead, Logistics Company</div></div></div>
                        </div></div>
                        <div className="slide"><div className="slide-card">
                            <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                            <p className="slide-txt">"Our agriculture platform needed real-time crop data and yield prediction. SoftMax's AI team built exactly that. What impressed me most was that they kept asking about ROI — not just features. That's rare."</p>
                            <div className="slide-author"><div className="s-av" style={{ background: "var(--g-cool)" }}>S</div><div><div className="s-name">Suresh Iyer</div><div className="s-role">Founder, AgriTech MSME</div></div></div>
                        </div></div>
                        <div className="slide"><div className="slide-card">
                            <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
                            <p className="slide-txt">"We needed a scalable e-commerce backend fast. SoftMax delivered on time, and the Spring Boot + Next.js stack they chose has handled every traffic spike without a single outage. Sub-second response times, just like they said."</p>
                            <div className="slide-author"><div className="s-av" style={{ background: "linear-gradient(135deg,var(--orange),var(--amber))" }}>A</div><div><div className="s-name">Aditi Sharma</div><div className="s-role">CTO, Retail Startup</div></div></div>
                        </div></div>
                    </div>
                    <div className="slide-nav-wrap">
                        <button className="sd on" data-i="0"></button>
                        <button className="sd" data-i="1"></button>
                        <button className="sd" data-i="2"></button>
                        <button className="sd" data-i="3"></button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Testimonials









// import React, { useEffect } from 'react'

// const Testimonials = () => {
//     useEffect(() => {
//       try {
//          // Slideshow
//     let cur = 0;
//     const track = document.getElementById('slTrack') as HTMLElement,
//       dots = document.querySelectorAll<HTMLElement>('.sd'),
//       total = dots.length;

//     const goTo = (n: number) => {
//       cur = (n + total) % total;
//       if (track) track.style.transform = 'translateX(-' + cur * 100 + '%)';
//       dots.forEach((d, i) => d.classList.toggle('on', i === cur));
//     };

//     document.getElementById('slPrev')?.addEventListener('click', () => goTo(cur - 1));
//     document.getElementById('slNext')?.addEventListener('click', () => goTo(cur + 1));

//     dots.forEach(d =>
//       d.addEventListener('click', () => goTo(+(d.dataset.i as string)))
//     );

//     setInterval(() => goTo(cur + 1), 5500);

//     let tx = 0;

//     track?.addEventListener('touchstart', (e: TouchEvent) => {
//       tx = e.touches[0].clientX;
//     }, { passive: true });

//     track?.addEventListener('touchend', (e: TouchEvent) => {
//       const dx = e.changedTouches[0].clientX - tx;
//       if (Math.abs(dx) > 50) goTo(cur + (dx < 0 ? 1 : -1));
//     });
//       } catch (error) {
        
//       }
//     }, [])
    
//     return (
//         <>
//             {/* <!-- =================== TESTIMONIALS =================== --> */}
//             <section className="testi-sec">
//                 <div className="sec-inner sec-c">
//                     <div className="sec-label fu"><i className="fas fa-star"></i> Testimonials</div>
//                     <h2 className="sec-title fu d1">Trusted by Industry Leaders</h2>
//                 </div>
//                 <div className="slides-outer fu d2">
//                     <button className="sl-arr sl-prev" id="slPrev"><i className="fas fa-chevron-left"></i></button>
//                     <button className="sl-arr sl-next" id="slNext"><i className="fas fa-chevron-right"></i></button>
//                     <div className="slides-track" id="slTrack">
//                         <div className="slide"><div className="slide-card">
//                             <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
//                             <p className="slide-txt">"Gaurion Bharat transformed our entire digital infrastructure in 8 months — something we thought would take 3 years. The AI matching brought us a team that felt like they were part of our company from day one. The KPI dashboards gave our leadership real confidence throughout the journey."</p>
//                             <div className="slide-author"><div className="s-av" style={{ background: "var(--g-main)" }}>R</div><div><div className="s-name">Rajesh Mehta</div><div className="s-role">CTO, Nexus Manufacturing — Mumbai</div></div></div>
//                         </div></div>
//                         <div className="slide"><div className="slide-card">
//                             <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
//                             <p className="slide-txt">"As a consultant, the platform is unlike anything I've used before. The smart matching is genuinely impressive — every project has been a perfect fit for my supply chain AI expertise. The managed mode removes all admin hassle so I can focus purely on delivering impact."</p>
//                             <div className="slide-author"><div className="s-av" style={{ background: "var(--g-warm)" }}>P</div><div><div className="s-name">Priya Nair</div><div className="s-role">Principal Consultant, Supply Chain AI — Bangalore</div></div></div>
//                         </div></div>
//                         <div className="slide"><div className="slide-card">
//                             <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
//                             <p className="slide-txt">"We achieved 4.2× return on our consulting investment through Gaurion Bharat. What impressed me most was the transparency — real-time dashboards meant no surprises. The quality of consultants on this platform is truly world-class, comparable to top global firms."</p>
//                             <div className="slide-author"><div className="s-av" style={{ background: "var(--g-cool)" }}>S</div><div><div className="s-name">Suresh Iyer</div><div className="s-role">CEO, TechVision MSME Solutions — Hyderabad</div></div></div>
//                         </div></div>
//                         <div className="slide"><div className="slide-card">
//                             <div className="stars"><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
//                             <p className="slide-txt">"We needed a cybersecurity overhaul in a very short timeframe. Gaurion matched us with the exact specialist within hours, not weeks. They achieved SOC 2 compliance two months ahead of schedule and under budget. This platform is a true game changer."</p>
//                             <div className="slide-author"><div className="s-av" style={{ background: "linear-gradient(135deg,var(--orange),var(--amber))" }}>A</div><div><div className="s-name">Aditi Sharma</div><div className="s-role">CISO, FinPro Capital — Delhi</div></div></div>
//                         </div></div>
//                     </div>
//                     <div className="slide-nav-wrap">
//                         <button className="sd on" data-i="0"></button>
//                         <button className="sd" data-i="1"></button>
//                         <button className="sd" data-i="2"></button>
//                         <button className="sd" data-i="3"></button>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }

// export default Testimonials