import React, { useEffect, useRef } from "react";
import "./About.css";

function About() {
  const observerRef = useRef(null);
  const illustrationRefs = useRef([]);

  const sections = [
    {
      imageSrc: "/assets/leopard-wife (4).png",
      description:
        "The data centre forms the engine of the system.  Here, data is extracted from various preselected sources, cleaned and transformed into elements that are suitable for  Machine Learning and Natural Language Processing, this is where we store and index Yoruba content and crunch a suitable output for user enquires, our models are trained on specific data to ease load shedding and be cost efficient. This component serves as the brain of the system."
    },
    {
      imageSrc: "/assets/leopard-wife (5).png",
      description:
        "The RAG (Retrieval Augumented Generative) system forms a bond between the user and content, showcasing generative AI capabilities, users have the liberty to interact with yoruba texts, ask questions about books and receive responses sourced from the knowledge base. Micro-learning assistance is provided in circumstances where users can explore meanings, historical contexts and insights about specific words. phrases, passages and traditions. Feeding off the knowledge base of the data centre, exercises and quizzes can be generated from chosen contents."
    },
    {
      imageSrc: "/assets/leopard-wife (1).png",
      description:
        " Our Text-to-Speech (TTS) and Speech-to-Text (STT) supports accessibility and inclusivity.  This service encourages diction-based interactions together with translation capabilities. research and development efforts focus on incorporating emerging technologies like voice recognition."
    }
  ];

  useEffect(() => {
    // Intersection Observer for fade-in animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Store current refs in a variable
    const currentRefs = illustrationRefs.current;

    // Observe illustration sections
    currentRefs.forEach((ref) => {
      if (ref) observerRef.current.observe(ref);
    });

    // Cleanup
    return () => {
      if (observerRef.current) {
        currentRefs.forEach((ref) => {
          if (ref) observerRef.current.unobserve(ref);
        });
      }
    };
  }, []);

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-content">
          <h1 className="fade-in">
            "A different language is a different vision of life"
          </h1>
          <p className="fade-in">
            Iwe is a research project looking to address the depth of artificial
            intelligence in informal education using a native language as a
            variable. The bulk of LLMs are trained in global languages and
            equipped with the knowledge to perform basic tasks, this technology
            has revolutionised mankind's approach to mundane matters and has
            earned a reputation as a guide to more complex tasks. In our context
            we want to apply the technology to Yoruba and include a Router
            System to streamline knowledge flow and improve expertise in our
            models, making it more accessible and fostering the preservation of
            culture. We want to enhance how we engage with literature, providing
            a unique and supportive learning experience.
          </p>
        </div>
        <div className="about-video-container">
          <iframe
            width="100%"
            height="300"
            src="https://www.youtube.com/embed/SjyBhqGK3rQ"
            title="Preserving Native Languages"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <div className="about-caption">
            <p>
              Tracing back over a millennium, Yoruba language and culture
              flourished under the Oyo Empire, spreading across West Africa and
              later dispersing during the transatlantic slave trade.
            </p>
          </div>
        </div>
      </div>
      <div className="dots-background"></div>

      <div className="section-2">
        <h1>Literature & Resources</h1>
        <div className="content-layout">
          <div className="text-content">
            <p>
              At Iwe we are building a comprehensive{" "}
              <span className="highlighted-text">
                digital library of yoruba literature
              </span>{" "}
              encompassing of classical and contemporary yoruba fiction and
              non-fiction. A collection of poetry from historical to modern
              times. Scholarly papers, essays of the yoruba socio-political
              landscape and digitized folktales and proverbs passed down through
              generations. Chapter based reading summarizing full texts into
              interactive segments and adaptative reading.
            </p>
          </div>

          <div className="books-container">
            {[
              {
                src: "/assets/the-leopard-wife.jpeg",
                alt: "Wives of the Leopard"
              },
              { src: "/assets/ife-m.jpeg", alt: "Ifẹ̀ Myths" },
              {
                src: "/assets/politics.jpeg",
                alt: "The Yoruba Nation and Politics"
              },
              { src: "/assets/drunkard.jpeg", alt: "The Palm-Wine Drinkard" }
            ].map((book, index) => (
              <div key={index} className="book book-hover">
                <img src={book.src} alt={book.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <h1>Language Tools</h1>
        <div className="tools-container">
          {[
            {
              image: "/assets/eyo.jpeg",
              title: "Yoruba Texts",
              description:
                "Discover a vast collection of authentic Yoruba literature, including books, journals, and articles sourced from multiple repositories. Explore original texts or access translated versions for a broader understanding of Yoruba culture"
            },
            {
              image: "/assets/box.png",
              title: "Audio Reading",
              description:
                "To support accessibility and inclusivity, Iwe incorporates Text-to-Speech functionality to enable users listen to books and articles read in a natural Yoruba voice with a dialect of choice, together with our Speech-to-Text functionality enabling users with diction-based interactions."
            },
            {
              image: "/assets/sisi.jpeg",
              title: "Translation Features",
              description:
                "Iwe integrates a RAG (Retrieval Augumented Generation) system to enable direct interaction with texts, users can ask questions about books, e-journals and receive responses sourced from original texts."
            }
          ].map((tool, index) => (
            <div key={index} className="tool-card tool-hover">
              <div className="tool-image">
                <img src={tool.image} alt={tool.title} />
              </div>
              <h2 className="tool-title">{tool.title}</h2>
              <p className="tool-description">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="containerr">
        <h1>AI & Technology</h1>
        <p className="subheading">HOW IT WORKS</p>

        {sections.map((section, index) => (
          <div
            key={index}
            className="illustration_wrapper"
            ref={(el) => (illustrationRefs.current[index] = el)}
          >
            <div className="illustration-container">
              <img
                src={section.imageSrc}
                alt={`Illustration ${index + 1}`}
                className="illustration"
              />
            </div>
            <p className="description">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
