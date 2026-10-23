import React from 'react'

const Team = () => {
    return (
        <>
            {/* <!-- =================== TEAM =================== --> */}
            <section className="team-sec" id="team">
                <div className="sec-inner sec-c">
                    <div className="sec-label fu"><i className="fas fa-users"></i> Our Team</div>
                    <h2 className="sec-title fu d1">The Minds Behind the Mission</h2>
                    <p className="sec-sub fu d2">Strategists, engineers, and domain experts united by one purpose — delivering measurable impact.</p>
                </div>
               <div className="sec-inner team-grid">
                    <div className="team-card fu">
                        <div className="t-ring">
                            <div className="t-av">
                                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgsTRI0GrE02I8yLwLIkF5CC8nLrGp-77eFYdZseBSXNiEL0yskfJTzUY10-SK5L3TggqlGwTR7EUa8cKLh6uKzF84QrDT35Oz049ETNSi5ciyK_AZPqiVxIBsbRW70Ky8xTk441Q9qB3G6EvGsOHo84XKsx4GTogaEh22F4MO7kW5OX4SBE2KBNbCzvns/s320/WhatsApp%20Image%202026-05-17%20at%204.27.48%20PM%20(1).jpeg" alt="Aryan" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                            </div>
                        </div>
                        <div className="t-name">Manisha Sharma</div>
                        <div className="t-role">Founder</div>
                        <div className="t-soc">
                            <a href="https://www.linkedin.com/in/vijaykumartiwari-csr/" target='_blank'><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                
                    <div className="team-card fu d1">
                        <div className="t-ring">
                            <div className="t-av" style={{ color: "var(--blue)" }}>
                                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgtz-ct0TGghwn6zcwhohi5k2UDciXIgOxE0GFnm30BlEHQ7KwjMM4SBcIEbpdpSxQSBmYnb9qqUlqqTcKZBaJwMrHLoK47DVcSPYiWLklMV9xeWyqg22nDc3R8f0l0b8SdmRttSm9nbEjuif5hEEMNQLoM39N_NY5b_VYJfb0Mi022rrMgikJe68nyDak/s320/WhatsApp%20Image%202026-05-17%20at%206.31.27%20PM.jpeg" alt="Sneha" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                            </div>
                        </div>
                        <div className="t-name">Vijay Kumar Tiwari</div>
                        <div className="t-role">Co-Founder</div>
                        <div className="t-soc">
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-github"></i></a>
                        </div>
                    </div>
                    
                    <div className="team-card fu d2">
                        <div className="t-ring">
                            <div className="t-av" style={{ color: "var(--orange)" }}>
                                <img src="https://media.licdn.com/dms/image/v2/D5603AQFI1XEPKGoQVw/profile-displayphoto-crop_800_800/B56Zm6vcf4IAAM-/0/1759774627694?e=1780531200&v=beta&t=833oc1ouRG4-7vBOQxpkguTb1TuiLnmoCZ_Kn3K7AcU" alt="Rahul" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                            </div>
                        </div>
                        <div className="t-name">Dr Isha Mishra</div>
                        <div className="t-role">Senior Director</div>
                        <div className="t-soc">
                            <a href="https://www.linkedin.com/in/dr-isha-419449257?utm_source=share_via&utm_content=profile&utm_medium=member_android"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    
                    <div className="team-card fu d3">
                        <div className="t-ring">
                            <div className="t-av" style={{ color: "var(--green)" }}>
                                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhb9I0CB7NziwpnoTo7-PDXP9dQ99pATrNd_L4QoKX0z6V9uR8YI06nHokh4ilJh8SqodGl4Tiefixg514WBiUmgsSMRTQn0TSZ8MM4QN9YW9sp786pZ2ctFblUb6p2hU3zdiH9M8fPmFXjVb7Hn7LZC4Q7VK4Z6M-pTx4eeOY5jrc-zilQG1WonSwg6KQ/s1254/ChatGPT%20Image%20May%2017,%202026,%2005_07_56%20PM.png" alt="Divya" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                            </div>
                        </div>
                        <div className="t-name">Mr. Sunil Seth</div>
                        <div className="t-role">Director of Compliance & Strategy</div>
                        <div className="t-soc">
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    
                    {/*<div className="team-card fu d4">
                        <div className="t-ring">
                            <div className="t-av" style={{ color: "var(--purple-l)" }}>
                                <img src="https://media.licdn.com/dms/image/v2/D4E03AQEP1TZe9oMTRA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1696032974795?e=1780531200&v=beta&t=1Lbb67Jvm_wBl2DV96Q3ZvPbbzPgreIAynKHoNvTpW0" alt="Kiran" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                            </div>
                        </div>
                        <div className="t-name">Kiran Reddy</div>
                        <div className="t-role">Lead Data Scientist</div>
                        <div className="t-soc">
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-github"></i></a>
                        </div>
                    </div>
                    
                    <div className="team-card fu d5">
                        <div className="t-ring">
                            <div className="t-av" style={{ color: "var(--amber)" }}>
                                <img src="https://media.licdn.com/dms/image/v2/D4E03AQEP1TZe9oMTRA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1696032974795?e=1780531200&v=beta&t=1Lbb67Jvm_wBl2DV96Q3ZvPbbzPgreIAynKHoNvTpW0" alt="Neha" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                            </div>
                        </div>
                        <div className="t-name">Neha Joshi</div>
                        <div className="t-role">Head of Product</div>
                        <div className="t-soc">
                            <a href="#"><i className="fab fa-linkedin-in"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div> */}
                </div>

                
            </section>
        </>
    )
}

export default Team