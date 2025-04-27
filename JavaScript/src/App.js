"use client"

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { useState } from "react"
import AntiVirusScanner from "./components/AntiVirusScanner"
import KeyloggerDetector from "./components/KeyloggerDetector"
import SteganographyTool from "./components/SteganographyTool"
import { GitHubIcon, ShieldIcon, KeyboardIcon, ImageIcon } from "./components/Icons"
import "./App.css"

function App() {
  const [activeTool, setActiveTool] = useState("/")

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <GitHubIcon className="github-icon" />
              <h1>InfoSec Suite</h1>
            </div>
            <div className="user-profile">
              <img src="/placeholder.svg?height=32&width=32" alt="User" className="avatar" />
            </div>
          </div>
        </header>

        <div className="main-container">
          <nav className="sidebar">
            <div className="repo-info">
              <h3>InfoSec Tools</h3>
              <p className="repo-description">
                Security tools for file scanning, keylogger detection, and steganography
              </p>
            </div>
            <ul className="nav-links">
              <li>
                <Link
                  to="/"
                  className={`nav-link ${activeTool === "/" ? "active" : ""}`}
                  onClick={() => setActiveTool("/")}
                >
                  <ShieldIcon className="nav-icon" />
                  AntiVirus Scanner
                </Link>
              </li>
              <li>
                <Link
                  to="/keylogger"
                  className={`nav-link ${activeTool === "/keylogger" ? "active" : ""}`}
                  onClick={() => setActiveTool("/keylogger")}
                >
                  <KeyboardIcon className="nav-icon" />
                  Keylogger Detector
                </Link>
              </li>
              <li>
                <Link
                  to="/steganography"
                  className={`nav-link ${activeTool === "/steganography" ? "active" : ""}`}
                  onClick={() => setActiveTool("/steganography")}
                >
                  <ImageIcon className="nav-icon" />
                  Steganography Tool
                </Link>
              </li>
            </ul>
            <div className="sidebar-footer">
              <div className="tech-stack">
                <span className="tech-badge">React</span>
                <span className="tech-badge">JavaScript</span>
                <span className="tech-badge">CryptoJS</span>
              </div>
            </div>
          </nav>

          <main className="content">
            <Routes>
              <Route path="/" element={<AntiVirusScanner />} />
              <Route path="/keylogger" element={<KeyloggerDetector />} />
              <Route path="/steganography" element={<SteganographyTool />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
