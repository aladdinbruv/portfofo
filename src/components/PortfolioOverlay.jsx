import { useState } from 'react'

const sections = [
  {
    id: 'about',
    title: 'About',
    content: (
      <div className="section-content">
        <h2>Professional Summary</h2>
        <p>A 23-year-old passionate web developer from Morocco, currently pursuing a Master's degree in Expert Web. I specialize in creating immersive web experiences using modern technologies, with a particular focus on 3D web development and interactive design.</p>
      </div>
    )
  },
  {
    id: 'experience',
    title: 'Experience',
    content: (
      <div className="section-content">
        <h2>Work Experience</h2>
        <div className="experience-item">
          <h3>Web Development Intern - TechMagic</h3>
          <p>• Developed and maintained responsive web applications using React and Three.js</p>
          <p>• Collaborated with senior developers on implementing 3D visualization features</p>
          <p>• Improved website performance by 40% through code optimization</p>
        </div>
      </div>
    )
  },
  {
    id: 'skills',
    title: 'Skills',
    content: (
      <div className="section-content">
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          <div className="skill-category">
            <h3>Frontend</h3>
            <ul>
              <li>React.js</li>
              <li>Three.js</li>
              <li>HTML5/CSS3</li>
              <li>JavaScript/ES6+</li>
              <li>Vite</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Tools & Others</h3>
            <ul>
              <li>Git/GitHub</li>
              <li>VS Code</li>
              <li>3D Modeling</li>
              <li>Responsive Design</li>
              <li>WebGL</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'projects',
    title: 'Projects',
    content: (
      <div className="section-content">
        <h2>Featured Projects</h2>
        <div className="project-item">
          <h3>3D Portfolio Website</h3>
          <p>Interactive portfolio featuring Three.js animations and React components in an Aladdin-themed environment.</p>
          <p>Technologies: React, Three.js, @react-three/fiber, @react-three/drei</p>
        </div>
      </div>
    )
  },
  {
    id: 'education',
    title: 'Education',
    content: (
      <div className="section-content">
        <h2>Educational Background</h2>
        <div className="education-item">
          <h3>Master's in Expert Web (In Progress)</h3>
          <p>Mohammed V University, Morocco</p>
          <p>Expected Graduation: 2024</p>
          <p>• Specialization in Modern Web Technologies</p>
          <p>• Research focus on 3D Web Applications</p>
        </div>
      </div>
    )
  },
  {
    id: 'contact',
    title: 'Contact',
    content: (
      <div className="section-content">
        <h2>Get in Touch</h2>
        <p>I'm always open to discussing new projects and opportunities.</p>
        <div className="contact-info">
          <p>Email: contact@portfolio-3d.dev</p>
          <p>LinkedIn: linkedin.com/in/morocco-webdev</p>
          <p>GitHub: github.com/3d-web-expert</p>
        </div>
      </div>
    )
  }
]

export function PortfolioOverlay() {
  const [activeSection, setActiveSection] = useState('about')

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId)
    window.dispatchEvent(new CustomEvent('sectionChange', { detail: sectionId }))
  }

  return (
    <div className="portfolio-overlay">
      <nav className="navigation">
        {sections.map(section => (
          <button
            key={section.id}
            className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => handleSectionChange(section.id)}
          >
            {section.title}
          </button>
        ))}
      </nav>
      <div className="content-section">
        {sections.find(section => section.id === activeSection)?.content}
      </div>
    </div>
  )
}