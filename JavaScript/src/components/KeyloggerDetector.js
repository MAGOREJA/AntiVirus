"use client"

import { useState, useEffect } from "react"
import { AlertIcon, CheckIcon } from "./Icons"

// Since browser JavaScript can't directly monitor system processes,
// this is a simulated version of the keylogger detector
function KeyloggerDetector() {
  const [detectionStatus, setDetectionStatus] = useState("idle")
  const [detectionResult, setDetectionResult] = useState(null)
  const [suspiciousActivity, setSuspiciousActivity] = useState([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [keyPressCount, setKeyPressCount] = useState(0)

  // Simulated suspicious processes
  const suspiciousProcesses = [
    { name: "keylogger.exe", description: "Known keylogger process" },
    { name: "spyware.exe", description: "Known spyware process" },
    { name: "logger.exe", description: "Potential keylogging software" },
    { name: "monitor.exe", description: "Suspicious monitoring process" },
    { name: "keyspy.exe", description: "Keyboard monitoring software" },
    { name: "inputcapture.exe", description: "Input capturing malware" },
  ]

  // Simulated detection function
  const simulateDetection = () => {
    setDetectionStatus("scanning")
    setDetectionResult(null)
    setSuspiciousActivity([])

    // Simulate scanning delay
    setTimeout(() => {
      // Randomly decide if we "detect" something (for demo purposes)
      const detected = Math.random() > 0.7

      if (detected) {
        // Randomly select 1-2 "suspicious" processes
        const detectedProcesses = []
        const numDetected = Math.floor(Math.random() * 2) + 1

        for (let i = 0; i < numDetected; i++) {
          const randomIndex = Math.floor(Math.random() * suspiciousProcesses.length)
          detectedProcesses.push(suspiciousProcesses[randomIndex])
        }

        setSuspiciousActivity(detectedProcesses)
        setDetectionResult({
          status: "warning",
          message: "Suspicious activity detected!",
        })
      } else {
        setDetectionResult({
          status: "success",
          message: "No suspicious activity detected.",
        })
      }

      setDetectionStatus("completed")
    }, 3000)
  }

  // Simulated monitoring function
  const startMonitoring = () => {
    setIsMonitoring(true)

    // Set up a keyboard event listener to count keypresses
    const handleKeyPress = () => {
      setKeyPressCount((prev) => prev + 1)
    }

    window.addEventListener("keydown", handleKeyPress)

    // In a real app, this would set up event listeners for keyboard activity
    // Here we'll just simulate occasional detections
    const monitoringInterval = setInterval(() => {
      // 10% chance of detecting something during monitoring
      if (Math.random() > 0.9) {
        const randomIndex = Math.floor(Math.random() * suspiciousProcesses.length)
        const detectedProcess = suspiciousProcesses[randomIndex]

        setSuspiciousActivity((prev) => {
          // Only add if not already in the list
          if (!prev.some((p) => p.name === detectedProcess.name)) {
            return [...prev, detectedProcess]
          }
          return prev
        })

        setDetectionResult({
          status: "warning",
          message: `Suspicious activity detected: ${detectedProcess.name}`,
        })
      }
    }, 5000)

    // Clean up function
    return () => {
      clearInterval(monitoringInterval)
      window.removeEventListener("keydown", handleKeyPress)
    }
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
    setKeyPressCount(0)
  }

  useEffect(() => {
    // Clean up when component unmounts
    let cleanup = () => {}

    if (isMonitoring) {
      cleanup = startMonitoring()
    }

    return () => {
      cleanup()
    }
  }, [isMonitoring])

  return (
    <div className="keylogger-detector">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Keylogger Detector</h2>
        </div>

        <p className="card-description">
          This tool simulates detection of keyloggers and suspicious keyboard monitoring activity. In a real
          environment, it would scan system processes and monitor for unusual input patterns.
        </p>

        <div className="button-group">
          <button
            className="button"
            onClick={simulateDetection}
            disabled={detectionStatus === "scanning" || isMonitoring}
          >
            Run Detection Scan
          </button>

          {!isMonitoring ? (
            <button className="button" onClick={startMonitoring} disabled={detectionStatus === "scanning"}>
              Start Continuous Monitoring
            </button>
          ) : (
            <button className="button button-danger" onClick={stopMonitoring}>
              Stop Monitoring
            </button>
          )}
        </div>

        {detectionStatus === "scanning" && (
          <div className="result-area">
            <p>Scanning for suspicious activity... Please wait.</p>
          </div>
        )}

        {detectionResult && (
          <div className="result-area">
            <div className={`status status-${detectionResult.status === "success" ? "clean" : "infected"}`}>
              {detectionResult.status === "success" ? (
                <>
                  <CheckIcon className="nav-icon" /> SECURE
                </>
              ) : (
                <>
                  <AlertIcon className="nav-icon" /> WARNING
                </>
              )}
            </div>
            <p>{detectionResult.message}</p>

            {suspiciousActivity.length > 0 && (
              <>
                <h3>Suspicious Processes Detected:</h3>
                <ul>
                  {suspiciousActivity.map((process, index) => (
                    <li key={index}>
                      <strong>{process.name}</strong>: {process.description}
                    </li>
                  ))}
                </ul>
                <p className="warning-text">
                  Note: In a real application, you would be able to terminate these processes. This is a simulation for
                  educational purposes.
                </p>
              </>
            )}
          </div>
        )}

        {isMonitoring && (
          <div className="monitoring-indicator">
            <div className="pulse"></div>
            <span>Monitoring active... {keyPressCount} keypresses detected</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default KeyloggerDetector
