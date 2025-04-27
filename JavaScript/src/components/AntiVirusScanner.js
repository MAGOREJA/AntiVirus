"use client"

import { useState, useRef } from "react"
import CryptoJS from "crypto-js"
import { UploadIcon, AlertIcon, CheckIcon } from "./Icons"

// Simulated malware signatures (in a real app, this would be loaded from a server)
const MALWARE_SIGNATURES = [
  "e4f49973d3b8f3d4012648fc30c5e5a3", // Example signature
  "5f4dcc3b5aa765d61d8327deb882cf99", // Example signature (md5 of "password")
  "d41d8cd98f00b204e9800998ecf8427e", // Empty file
]

function AntiVirusScanner() {
  const [scanResult, setScanResult] = useState(null)
  const [fileName, setFileName] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [quarantineLog, setQuarantineLog] = useState([])
  const [showQuarantineLog, setShowQuarantineLog] = useState(false)
  const fileInputRef = useRef(null)

  const calculateFileHash = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const wordArray = CryptoJS.lib.WordArray.create(e.target.result)
        const hash = CryptoJS.MD5(wordArray).toString()
        resolve(hash)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const scanFile = async (file) => {
    setIsScanning(true)
    setScanResult(null)

    try {
      const fileHash = await calculateFileHash(file)

      // Check if the file hash matches any known malware signatures
      const isMalicious = MALWARE_SIGNATURES.includes(fileHash)

      if (isMalicious) {
        // Add to quarantine log
        const newQuarantineEntry = {
          fileName: file.name,
          fileSize: file.size,
          fileHash: fileHash,
          timestamp: new Date().toISOString(),
        }

        setQuarantineLog((prevLog) => [...prevLog, newQuarantineEntry])

        setScanResult({
          status: "infected",
          message: `File '${file.name}' is malicious and has been quarantined.`,
          hash: fileHash,
        })
      } else {
        setScanResult({
          status: "clean",
          message: `File '${file.name}' is clean.`,
          hash: fileHash,
        })
      }
    } catch (error) {
      setScanResult({
        status: "error",
        message: `Error scanning file: ${error.message}`,
      })
    } finally {
      setIsScanning(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      scanFile(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setFileName(file.name)
      scanFile(file)
    }
  }

  const handleViewQuarantineLog = () => {
    setShowQuarantineLog(!showQuarantineLog)
  }

  return (
    <div className="antivirus-scanner">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">AntiVirus Scanner</h2>
        </div>

        <p className="card-description">
          Upload a file to scan it for malware. The scanner will calculate the file's MD5 hash and compare it against
          known malware signatures.
        </p>

        <div
          className="file-upload"
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} />
          <UploadIcon className="nav-icon" />
          <p className="file-upload-text">{fileName ? fileName : "Click or drag file to scan"}</p>
        </div>

        <button className="button" onClick={handleViewQuarantineLog}>
          {showQuarantineLog ? "Hide Quarantine Log" : "View Quarantine Log"}
        </button>

        {isScanning && (
          <div className="result-area">
            <p>Scanning file... Please wait.</p>
          </div>
        )}

        {scanResult && !isScanning && (
          <div className="result-area">
            <div className={`status status-${scanResult.status}`}>
              {scanResult.status === "clean" ? (
                <>
                  <CheckIcon className="nav-icon" /> CLEAN
                </>
              ) : (
                <>
                  <AlertIcon className="nav-icon" /> INFECTED
                </>
              )}
            </div>
            <p>{scanResult.message}</p>
            {scanResult.hash && <p>File Hash: {scanResult.hash}</p>}
          </div>
        )}

        {showQuarantineLog && (
          <div className="result-area">
            <h3>Quarantine Log</h3>
            {quarantineLog.length === 0 ? (
              <p>No files have been quarantined.</p>
            ) : (
              <ul>
                {quarantineLog.map((entry, index) => (
                  <li key={index}>
                    <strong>{entry.fileName}</strong> ({entry.fileSize} bytes)
                    <br />
                    Hash: {entry.fileHash}
                    <br />
                    Quarantined at: {new Date(entry.timestamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AntiVirusScanner
