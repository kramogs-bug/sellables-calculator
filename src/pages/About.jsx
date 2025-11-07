import { useState } from 'react';
import { sellablesIcons } from '../assets/assets'; // Import your assets

export default function About() {
  const [activeService, setActiveService] = useState(0);

  const projects = [
    {
      id: 1,
      name: "Cruze IT Solutions",
      description: "A modern IT solutions company website built with Next.js and Tailwind CSS, featuring responsive design and modern UI components.",
      technologies: ["Next.js", "Tailwind CSS", "React", "TypeScript"],
      githubUrl: "https://github.com/kramogs-bug/cruze-it",
      liveUrl: "https://cruze-it.vercel.app/"
    },
    {
      id: 2,
      name: "Graal Sellables Calculator",
      description: "A comprehensive calculator for GraalOnline Era players to track and calculate the value of sellable items in real-time.",
      technologies: ["React", "Tailwind CSS", "JavaScript", "LocalStorage"],
      githubUrl: "https://github.com/kramogs-bug/graal-calculator",
      liveUrl: "/"
    },
    {
      id: 3,
      name: "Game Automation Framework",
      description: "A robust framework for creating automated scripts and macros for various online games.",
      technologies: ["Macrorify", "Macro Recorder", "Jitbit", "AutoHotkey"],
      githubUrl: "https://github.com/kramogs-bug/game-automation",
      liveUrl: "#"
    }
  ];

  const skills = [
    { name: "JavaScript/TypeScript", level: 90 },
    { name: "Python", level: 85 },
    { name: "React/Next.js", level: 88 },
    { name: "Game Automation", level: 92 },
    { name: "Bot Development", level: 87 },
    { name: "Computer Vision", level: 80 }
  ];

  const services = [
    {
      title: "Custom Macros",
      description: "Tailored automation scripts designed for your specific gameplay style and objectives.",
      features: ["Personalized Solutions", "Efficient Execution", "Regular Updates"]
    },
    {
      title: "Game Bots",
      description: "Advanced bots for farming, trading, and automated task management in MMORPGs.",
      features: ["24/7 Operation", "Anti-Detection", "Multi-Account Support"]
    },
    {
      title: "Script Optimization",
      description: "Performance tuning and enhancement of existing automation scripts.",
      features: ["Speed Improvements", "Resource Efficiency", "Bug Fixes"]
    }
  ];

  const contactMethods = [
    { 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027A19.5 19.5 0 0 0 .001 19.308a.077.077 0 0 0 .031.057a19.788 19.788 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.66 14.66 0 0 0 1.303-2.087a.076.076 0 0 0-.042-.105a13.107 13.107 0 0 1-1.872-.892a.075.075 0 0 1-.008-.127a10.888 10.888 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.8 8.18 1.8 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.075.075 0 0 1-.007.127a12.346 12.346 0 0 1-1.872.892a.077.077 0 0 0-.042.105c.37.759.82 1.47 1.304 2.087a.076.076 0 0 0 .084.028a19.78 19.78 0 0 0 5.993-3.03a.077.077 0 0 0 .031-.057a19.499 19.499 0 0 0-3.644-14.91a.07.07 0 0 0-.032-.027zM8.02 15.33c-1.183 0-2.157-1.12-2.157-2.543c0-1.42.935-2.544 2.157-2.544c1.222 0 2.158 1.12 2.158 2.544c0 1.423-.936 2.543-2.158 2.543zm7.975 0c-1.183 0-2.157-1.12-2.157-2.543c0-1.42.935-2.544 2.157-2.544c1.222 0 2.158 1.12 2.158 2.544c0 1.423-.936 2.543-2.158 2.543z"/>
        </svg>
      ), 
      label: "Discord", 
      value: "itzmekramogs#2528", 
      link: "https://discord.com/users/itzmekramogs" 
    },
    { 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ), 
      label: "Email", 
      value: "vjohnmark673@gmail.com", 
      link: "mailto:vjohnmark673@gmail.com" 
    },
    { 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ), 
      label: "GitHub", 
      value: "github.com/kramogs-bug", 
      link: "https://github.com/kramogs-bug" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 overflow-hidden border-4 border-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
              <img 
                src={sellablesIcons.profile} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-white text-5xl font-bold">YC</span>';
                  e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-500', 'via-purple-500', 'to-pink-500');
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Kramogss
          </h1>
          
          <p className="text-2xl text-blue-200 mb-8 font-light">
            Game Automation Specialist & Full-Stack Developer
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.link}
                className="group flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:scale-105 text-slate-300 hover:text-white shadow-lg hover:shadow-blue-500/20"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="group-hover:text-blue-400 transition-colors">{method.icon}</span>
                <span className="font-medium">{method.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="mb-20">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 sm:p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                <img 
                  src={sellablesIcons.profile} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">YC</div>';
                  }}
                />
              </div>
              <h2 className="text-4xl font-bold text-white">About Me</h2>
            </div>
            
            <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
              <p>
                I'm a passionate developer specializing in game automation, macro development, and full-stack web applications. 
                With years of experience in creating efficient automation solutions for various online games, I help players 
                optimize their gameplay and maximize efficiency.
              </p>
              
              <p>
                My expertise includes developing sophisticated bots, automation scripts, and custom macros for games like 
                GraalOnline Era, RuneScape, and other MMORPGs. I focus on creating reliable, undetectable, and highly 
                efficient solutions that enhance your gaming experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                      <path d="M13.5 2L3 13.5h7v8l10.5-11.5h-7z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">What I Offer</h3>
                </div>
                <ul className="space-y-4">
                  {["Custom game automation scripts", "Macro development and optimization", "Bot creation for various games", "Web applications and tools", "Performance optimization"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-400">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
                      <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Games I Work With</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["GraalOnline Era", "RuneScape", "World of Warcraft", "Various MMORPGs", "Browser Games"].map((game, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                    >
                      {game}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-20">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 sm:p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white">Technical Skills</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white text-lg">{skill.name}</span>
                    <span className="text-blue-400 font-bold">{skill.level}%</span>
                  </div>
                  <div className="relative w-full bg-slate-900/50 rounded-full h-4 overflow-hidden border border-slate-700">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/50"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-20">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 sm:p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white">Featured Projects</h2>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden hover:border-blue-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                >
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500"></div>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="white" className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                    </svg>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3">{project.name}</h3>
                    <p className="text-slate-400 mb-4 leading-relaxed">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-medium border border-blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={project.githubUrl}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all duration-300 font-medium border border-slate-700 hover:border-slate-600"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Code
                      </a>
                      <a
                        href={project.liveUrl}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/50"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                        </svg>
                        Demo
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-20">
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-1 shadow-2xl shadow-purple-500/20">
            <div className="bg-slate-900 rounded-[22px] p-8 sm:p-12">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 13c-.83 0-1.5-.67-1.5-1.5S7.67 10 8.5 10s1.5.67 1.5 1.5S9.33 13 8.5 13zm5.5 5h-4v-2h4v2zm3.5-3.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
                  </svg>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Game Automation Services</h2>
                <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                  Transform your gaming experience with custom automation solutions. Boost efficiency, automate repetitive tasks, and maximize your gameplay potential.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {services.map((service, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveService(index)}
                    className={`group cursor-pointer bg-white/5 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 ${
                      activeService === index 
                        ? 'border-blue-400 bg-white/10 scale-105' 
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                      activeService === index 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50' 
                        : 'bg-white/10'
                    }`}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                        {index === 0 && <path d="M13.5 2L3 13.5h7v8l10.5-11.5h-7z"/>}
                        {index === 1 && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8.5 13c-.83 0-1.5-.67-1.5-1.5S7.67 10 8.5 10s1.5.67 1.5 1.5S9.33 13 8.5 13zm5.5 5h-4v-2h4v2zm3.5-3.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>}
                        {index === 2 && <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>}
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-blue-200 mb-4 leading-relaxed">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-blue-100 text-sm">
                          <div className="w-5 h-5 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-400">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <a
                  href="https://discord.com/users/itzmekramogs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/20"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027A19.5 19.5 0 0 0 .001 19.308a.077.077 0 0 0 .031.057a19.788 19.788 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.66 14.66 0 0 0 1.303-2.087a.076.076 0 0 0-.042-.105a13.107 13.107 0 0 1-1.872-.892a.075.075 0 0 1-.008-.127a10.888 10.888 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.8 8.18 1.8 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.075.075 0 0 1-.007.127a12.346 12.346 0 0 1-1.872.892a.077.077 0 0 0-.042.105c.37.759.82 1.47 1.304 2.087a.076.076 0 0 0 .084.028a19.78 19.78 0 0 0 5.993-3.03a.077.077 0 0 0 .031-.057a19.499 19.499 0 0 0-3.644-14.91a.07.07 0 0 0-.032-.027zM8.02 15.33c-1.183 0-2.157-1.12-2.157-2.543c0-1.42.935-2.544 2.157-2.544c1.222 0 2.158 1.12 2.158 2.544c0 1.423-.936 2.543-2.158 2.543zm7.975 0c-1.183 0-2.157-1.12-2.157-2.543c0-1.42.935-2.544 2.157-2.544c1.222 0 2.158 1.12 2.158 2.544c0 1.423-.936 2.543-2.158 2.543z"/>
                  </svg>
                  Get Started - Contact on Discord
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 sm:p-12 shadow-2xl">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Transform Your Gameplay?</h3>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Let's discuss your automation needs and create custom solutions tailored to your goals.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.link}
                  className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 font-semibold shadow-lg hover:shadow-blue-500/50"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="group-hover:scale-110 transition-transform">{method.icon}</span>
                  <span>Contact via {method.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
