"use client"

import { useState } from "react"
import { Shield, FileText, AlertTriangle, CheckCircle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AntiVirusApp() {
  const [scanResult, setScanResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [quarantineLog, setQuarantineLog] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLog = localStorage.getItem("quarantineLog")
      return savedLog ? JSON.parse(savedLog) : []
    }
    return []
  })

  // Simulated malware signatures
  const malwareSignatures = ["infected_file_hash", "malware_sample_hash"]

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setScanResult(null)

    // Simulate scanning process
    setTimeout(() => {
      // Simulate hash calculation and checking
      const isClean = !simulateIsMalicious(file.name)
      setScanResult({ isClean, fileName: file.name })

      // If file is malicious, add to quarantine
      if (!isClean) {
        const newQuarantineEntry = {
          fileName: file.name,
          path: `C:/Users/Documents/${file.name}`,
          timestamp: new Date().toLocaleString(),
        }

        const updatedLog = [...quarantineLog, newQuarantineEntry]
        setQuarantineLog(updatedLog)
        localStorage.setItem("quarantineLog", JSON.stringify(updatedLog))
      }

      setIsScanning(false)
    }, 2000)
  }

  // Simulate malware detection (for demo purposes)
  const simulateIsMalicious = (fileName) => {
    // For demo purposes, files with "virus" or "malware" in the name will be flagged
    return fileName.toLowerCase().includes("virus") || fileName.toLowerCase().includes("malware")
  }

  // Simulate file hash calculation
  const simulateCalculateFileHash = (file) => {
    // In a real app, you would calculate an actual hash
    return `simulated_hash_${file.name.length}_${file.size}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-emerald-500" />
            <h1 className="text-2xl font-bold">SecureShield AntiVirus</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-sm font-medium hover:text-emerald-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium hover:text-emerald-500 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium hover:text-emerald-500 transition-colors">
                  About
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="scan" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="scan">Scan Files</TabsTrigger>
            <TabsTrigger value="quarantine">Quarantine Log</TabsTrigger>
          </TabsList>

          <TabsContent value="scan">
            <Card>
              <CardHeader>
                <CardTitle>Scan Files for Malware</CardTitle>
                <CardDescription>Upload a file to scan it for potential threats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Drag and drop a file here, or click to select a file
                  </p>
                  <Button asChild>
                    <label>
                      Browse Files
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </Button>
                </div>

                {isScanning && (
                  <div className="mt-6 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
                    <p className="mt-2">Scanning file...</p>
                  </div>
                )}

                {scanResult && (
                  <div
                    className={`mt-6 p-4 rounded-lg ${scanResult.isClean ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}
                  >
                    <div className="flex items-center">
                      {scanResult.isClean ? (
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                      )}
                      <div>
                        <h3 className="font-medium">{scanResult.isClean ? "File is clean" : "Threat detected!"}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{scanResult.fileName}</p>
                        {!scanResult.isClean && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            This file has been moved to quarantine
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">Supported file types: All files</p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="quarantine">
            <Card>
              <CardHeader>
                <CardTitle>Quarantine Log</CardTitle>
                <CardDescription>View and manage quarantined files</CardDescription>
              </CardHeader>
              <CardContent>
                {quarantineLog.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No files have been quarantined</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            File Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Original Path
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Quarantined On
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y">
                        {quarantineLog.map((entry, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{entry.fileName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {entry.path}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {entry.timestamp}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuarantineLog([])
                    localStorage.setItem("quarantineLog", JSON.stringify([]))
                  }}
                  disabled={quarantineLog.length === 0}
                >
                  Clear Quarantine
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6">Protection Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monitors your system continuously to detect and block threats before they can harm your device.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Malware Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Advanced scanning engine that can identify various types of malware including viruses, trojans, and
                  ransomware.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quarantine System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Safely isolates infected files to prevent them from causing harm to your system.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-950 border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-emerald-500" />
              <span className="font-bold">SecureShield AntiVirus</span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} SecureShield. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
