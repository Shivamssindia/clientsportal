'use client'
import React, { useEffect } from 'react'

const Metrics = () => {
    useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>("[data-t]");

    const cIO = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;

            const target = Number(el.dataset.t);
            const suffix = el.dataset.s || "";

            let count = 0;
            const step = Math.max(1, Math.ceil(target / 55));

            const interval = setInterval(() => {
              count = Math.min(count + step, target);
              el.textContent = count + suffix;

              if (count >= target) {
                clearInterval(interval);
              }
            }, 22);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((c) => cIO.observe(c));

    // Cleanup ⚠️
    return () => {
      cIO.disconnect();
    };
  }, []);


    return (
        <>
            {/* <!-- =================== METRICS =================== --> */}
            <section className="metrics-sec">
                <div className="metrics-grid">
                    <div className="fu"><div className="met-num" data-t="99" data-s="%">0</div><div className="met-lbl">Business Problems AI Can Solve</div></div>
                    <div className="fu d1"><div className="met-num" data-t="500" data-s="+">0</div><div className="met-lbl">Solutions Delivered</div></div>
                    <div className="fu d2"><div className="met-num" data-t="98" data-s="%">0</div><div className="met-lbl">Client Satisfaction</div></div>
                    <div className="fu d3"><div className="met-num" data-t="24" data-s="/7">0</div><div className="met-lbl">Transparent Tracking</div></div>
                </div>
            </section>
        </>
    )
}

export default Metrics