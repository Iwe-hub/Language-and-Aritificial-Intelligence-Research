import React, { useEffect, useRef, useState } from "react";

import "./Home.css";

function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const sectionRefs = {
    sectionOne: useRef(null),
    sectionTwo: useRef(null),
    sectionThree: useRef(null),
    sectionFour: useRef(null),
    sectionSix: useRef(null)
  };

  const [isVisible, setIsVisible] = useState({
    sectionOne: false,
    sectionTwo: false,
    sectionThree: false,
    sectionFour: false,
    sectionSix: false
  });

  useEffect(() => {
    // Responsive design check
    const checkMobileView = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobileView();

    // Add resize listener
    window.addEventListener("resize", checkMobileView);

    // Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: isMobile ? 0.05 : 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        const sectionMapping = {
          "section-one": "sectionOne",
          "section-two": "sectionTwo",
          "section-three": "sectionThree",
          "section-four": "sectionFour",
          "section-six": "sectionSix"
        };

        if (sectionMapping[sectionId]) {
          setIsVisible((prev) => ({
            ...prev,
            [sectionMapping[sectionId]]: entry.isIntersecting
          }));
        }
      });
    }, observerOptions);

    // Select and observe sections
    const sectionsToObserve = [
      sectionRefs.sectionOne.current,
      sectionRefs.sectionTwo.current,
      document.getElementById("section-three"),
      document.getElementById("section-four"),
      document.getElementById("section-six")
    ];

    sectionsToObserve.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobileView);
      observer.disconnect();
    };
  }, [isMobile, sectionRefs.sectionOne, sectionRefs.sectionTwo]);

  return (
    <div className="overflow-x-hidden relative">
      <div
        ref={sectionRefs.sectionOne}
        id="section-one"
        className={`home-container transition-all duration-700 ${
          isVisible.sectionOne ? "fade-in-smooth" : "opacity-0"
        }`}
      >
        <div className="section-one-container">
          <div className="section-one-about">
            <h1 className={isVisible.sectionOne ? "slide-in-left" : ""}>
              Explore Yoruba Culture & Language With Iwe
            </h1>
            <p className={isVisible.sectionOne ? "slide-in-right" : ""}>
              Experience the vibrant world of Yoruba culture with Iwe, where
              innovative technology bridges the gap between tradition and modern
              learning. Our platform provides an extensive Yoruba Literature
              Archive, allowing users to explore original texts or translated
              works that reflect the rich narratives and wisdom of the Yoruba
              people. Enjoy seamless access to diverse educational resources,
              audio readings, and interactive tools designed for an engaging
              learning experience.
            </p>

            <button className={isVisible.sectionOne ? "join-button" : ""}>
              Join Us Today
            </button>
          </div>
          <div className="image-composition">
            <div
              className={`chat-bubble-top-left chat-bubble ${
                isVisible.sectionOne ? "pop-in" : ""
              }`}
            ></div>
            <img
              src="\assets\publicContain.png"
              alt="Content visualization"
              className={`main-image ${isVisible.sectionOne ? "zoom-in" : ""}`}
            />
            <img
              src="/assets/photo-1599081593734-5e65dd7abfba.jpeg"
              alt="Person"
              className={`person-image ${
                isVisible.sectionOne ? "slide-in-bottom" : ""
              }`}
            />
            <img
              src="\assets\public.jpeg"
              alt="Bottom Left"
              className={`bottom-left-image ${
                isVisible.sectionOne ? "slide-in-top" : ""
              }`}
            />
            <img
              src="/assets\YWC.jpg"
              alt="Person"
              className={`bottom-img ${
                isVisible.sectionOne ? "slide-in-bottom" : ""
              }`}
            />
            <img
              src="\assets\yellow-bubble.svg"
              alt="Person"
              className={`top-img ${
                isVisible.sectionOne ? "slide-in-bottom" : ""
              }`}
            />
            <div
              className={`chat-bubble-bottom-right chat-bubble ${
                isVisible.sectionOne ? "pop-in" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>
      ''
      <div
        ref={sectionRefs.sectionTwo}
        id="section-two"
        className={`section-two transition-all duration-700 ${
          isVisible.sectionTwo ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="section-two-about">
          <h1 className={isVisible.sectionTwo ? "fade-in-up" : ""}>
            Preserving the <span>tapestry</span> of Yoruba life and enabling
            immersion in authentic literature, audio narratives, and interactive
            educational tools.
          </h1>
        </div>
        <div className="section-two-content">
          <p className={isVisible.sectionTwo ? "fade-in-up delay-100" : ""}>
            The Yoruba writing system has mirrored its own evolution, a system
            of ideograms known as Nsidibi served as a form of coded
            communication heavily influenced by adlibs and lullabies. Our
            platform bridges the gap between ancient traditions and modern
            learning experiences.
          </p>
        </div>
      </div>
      {/* Section Three Component */}
      <div
        ref={sectionRefs.sectionThree}
        id="section-three"
        className={`section-three transition-all duration-700 ${
          isVisible.sectionThree ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="card-container-three">
          <div
            className={`card-three ${isVisible.sectionThree ? "scale-in" : ""}`}
          >
            <div className="card-title">
              Literature <span>Archive</span>
            </div>
            <div className="card-description">
              Unlock access to a meticulously indexed collection of Yoruba
              texts, including literature, journals, and articles for
              comprehensive exploration.
            </div>
            <div className="spiral-icon-1">
              <img src="\assets\globe.svg" alt="Globe decoration" />
            </div>
            <div className="search-icon"></div>
          </div>

          <div
            className={`card-three ${
              isVisible.sectionThree ? "scale-in delay-100" : ""
            }`}
          >
            <div className="card-title">
              Audio Reading <span>Narratives</span>
            </div>
            <div className="card-description">
              Experience fluent readings in various dialects with our
              Text-to-Speech functionality, enhancing your comprehension of
              Yoruba literature.
            </div>
            <div className="spiral-icon-2">
              <img src="\assets\globe.svg" alt="Globe decoration" />
            </div>
            <div className="search-icon"></div>
          </div>

          <div
            className={`card-three ${
              isVisible.sectionThree ? "scale-in delay-200" : ""
            }`}
          >
            <div className="card-title">
              Instant Translation <span> Capabilities</span>
            </div>
            <div className="card-description">
              Effortlessly translate between Yoruba and multiple languages,
              retaining cultural nuances for deeper understanding.
            </div>
            <div className="spiral-icon">
              <img src="\assets\arrow.svg" alt="Arrow decoration" />
            </div>
            <div className="search-icon"></div>
          </div>
        </div>
      </div>
      <div
        ref={sectionRefs.sectionFour}
        id="section-four"
        className={`section-four transition-all duration-500 ${
          isVisible.sectionFour ? "fade-in-slow" : "opacity-0"
        }`}
      >
        <div className="section-four-about">
          <h1>
            Discover the Depths of Artificial Intelligence in education and a
            supportive learning landscape.
          </h1>
        </div>
        <div className="section-four-content">
          <p>
            Methods to innovate and revitalise endangered languages have evolved
            into a substantial body of literature with diverse perspectives
            capturing AI algorithms and revolutionising the capabilities of
            educational robots that have now become an integral part of
            learning, providing support for a wide range of teaching and
            learning activities.
          </p>
        </div>
      </div>
      {/* // Section Five (Heading for the robots section) */}
      <div className="section-five">
        <h1 className={isVisible.sectionSix ? "fade-scale" : ""}>
          Meet the Digital Ambassadors
        </h1>
      </div>
      {/* // Section Six (Robot Cards) */}
      <div
        ref={sectionRefs.sectionSix}
        id="section-six"
        className={`section-six transition-all duration-700 ${
          isVisible.sectionSix ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="section-six-card">
          <div className={`card-six ${isVisible.sectionSix ? "slide-up" : ""}`}>
            <img src="assets\public (1).jpeg" alt="Ajike" />
            <div className="card-six-content">
              <h2>Experience the Beauty of Yoruba Literature</h2>
              <p>
                <span className="bot-name">Ajike</span> is trained on advanced
                language models and specializes in Yoruba literature. She's your
                guide to books, poetry, journals, and academic articles, with
                expertise in processing texts across various regional dialects.
              </p>
              <span className="bot-tag">Literature Expert</span>
            </div>
          </div>

          <div
            className={`card-six ${
              isVisible.sectionSix ? "slide-up delay-100" : ""
            }`}
          >
            <img
              src="\assets\f1b6ca8f-0894-4037-bad6-535b26b50343.jpeg"
              alt="Moyo"
            />
            <div className="card-six-content">
              <h2>Navigate Cultural Context and History</h2>
              <p>
                <span className="bot-name">Moyo</span> provides cultural and
                historical context to enrich your understanding of Yoruba
                traditions. He offers insights into ceremonies, folklore, and
                traditional practices that have shaped Yoruba society.
              </p>
              <span className="bot-tag">Cultural Guide</span>
            </div>
          </div>

          <div
            className={`card-six ${
              isVisible.sectionSix ? "slide-up delay-200" : ""
            }`}
          >
            <img src="\assets\publicContain.jpeg" alt="Kazeem" />
            <div className="card-six-content">
              <h2>Master Yoruba Language Through Conversation</h2>
              <p>
                <span className="bot-name">Kazeem</span> serves as your personal
                language tutor, helping you develop practical communication
                skills in Yoruba. He offers vocabulary building, pronunciation
                guidance, and conversational practice for learners at all
                levels.
              </p>
              <span className="bot-tag">Language Tutor</span>
            </div>
          </div>
        </div>
      </div>
      {/* // Section Seven (Contact Form) */}
      <div className="section-seven">
        <div
          className="section-seven-content"
          ref={sectionRefs.sectionSeven}
          id="section-seven"
        >
          <div
            className={`container-seven ${
              isVisible.sectionSeven ? "fade-scale" : ""
            }`}
          >
            <div className="left-section">
              <img
                src="\assets\public (2).jpeg"
                alt="Yoruba Cultural Heritage"
              />
            </div>
            <div className="form-section">
              <h2 className={isVisible.sectionSeven ? "slide-up" : ""}>
                Join Our Community of Yoruba Culture Enthusiasts
              </h2>
              <form
                className={isVisible.sectionSeven ? "slide-up delay-100" : ""}
              >
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  required
                />

                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  required
                />

                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  placeholder="Share your interests or questions about Yoruba culture"
                  required
                ></textarea>

                <button type="submit">Connect With Us</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
