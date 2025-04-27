"use client"

import { useState, useRef } from "react"
import { ImageIcon, DownloadIcon } from "./Icons"

function SteganographyTool() {
  const [mode, setMode] = useState("encode") // 'encode' or 'decode'
  const [text, setText] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [decodedText, setDecodedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.match("image.*")) {
      setErrorMessage("")
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          setSelectedImage(img)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    } else if (file) {
      setErrorMessage("Please select a valid image file.")
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.match("image.*")) {
      setErrorMessage("")
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          setSelectedImage(img)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    } else if (file) {
      setErrorMessage("Please select a valid image file.")
    }
  }

  const textToBinary = (text) => {
    let binary = ""
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i)
      const binaryChar = charCode.toString(2).padStart(8, "0")
      binary += binaryChar
    }
    // Add delimiter to mark end of text
    binary += "11111111" // 8 ones as delimiter
    return binary
  }

  const binaryToText = (binary) => {
    let text = ""
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substr(i, 8)
      if (byte === "11111111") break // End delimiter

      const charCode = Number.parseInt(byte, 2)
      text += String.fromCharCode(charCode)
    }
    return text
  }

  const encodeImage = () => {
    if (!selectedImage || !text) {
      setErrorMessage("Please select an image and enter text to encode.")
      return
    }

    setIsProcessing(true)
    setErrorMessage("")

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      // Set canvas dimensions to match the image
      canvas.width = selectedImage.width
      canvas.height = selectedImage.height

      // Draw the original image on the canvas
      ctx.drawImage(selectedImage, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Convert text to binary
      const binaryText = textToBinary(text)

      // Check if the image can store the text (each pixel can store 3 bits - one in each RGB channel)
      const maxBits = data.length * 0.75 // Only using 3 out of every 4 bytes (R,G,B, not A)
      if (binaryText.length > maxBits) {
        setErrorMessage("Text is too long to encode in this image.")
        setIsProcessing(false)
        return
      }

      // Encode the binary text into the image
      let binaryIndex = 0
      for (let i = 0; i < data.length; i += 4) {
        if (binaryIndex < binaryText.length) {
          // Modify the least significant bit of R, G, and B channels
          for (let j = 0; j < 3; j++) {
            // R, G, B (skip A)
            if (binaryIndex < binaryText.length) {
              // Clear the LSB and set it to the bit from our text
              data[i + j] = (data[i + j] & 0xfe) | Number.parseInt(binaryText[binaryIndex])
              binaryIndex++
            }
          }
        } else {
          break
        }
      }

      // Put the modified image data back on the canvas
      ctx.putImageData(imageData, 0, 0)

      // Set the result image
      setResultImage(canvas.toDataURL("image/png"))
    } catch (error) {
      setErrorMessage(`Error encoding image: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const decodeImage = () => {
    if (!selectedImage) {
      setErrorMessage("Please select an image to decode.")
      return
    }

    setIsProcessing(true)
    setErrorMessage("")
    setDecodedText("")

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      // Set canvas dimensions to match the image
      canvas.width = selectedImage.width
      canvas.height = selectedImage.height

      // Draw the image on the canvas
      ctx.drawImage(selectedImage, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Extract binary data from the image
      let extractedBinary = ""
      let consecutiveOnes = 0

      for (let i = 0; i < data.length; i += 4) {
        // Extract LSB from R, G, and B channels
        for (let j = 0; j < 3; j++) {
          const bit = data[i + j] & 1
          extractedBinary += bit

          // Check for delimiter (8 consecutive ones)
          if (bit === 1) {
            consecutiveOnes++
            if (consecutiveOnes === 8) {
              // Found delimiter, stop extraction
              extractedBinary = extractedBinary.slice(0, -8) // Remove delimiter
              break
            }
          } else {
            consecutiveOnes = 0
          }
        }

        if (consecutiveOnes === 8) break
      }

      // Convert binary to text
      const text = binaryToText(extractedBinary)
      setDecodedText(text)
    } catch (error) {
      setErrorMessage(`Error decoding image: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement("a")
      link.href = resultImage
      link.download = "steganography_encoded.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="steganography-tool">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Steganography Tool</h2>
          <div className="mode-toggle">
            <button className={`button ${mode === "encode" ? "active" : ""}`} onClick={() => setMode("encode")}>
              Encode
            </button>
            <button className={`button ${mode === "decode" ? "active" : ""}`} onClick={() => setMode("decode")}>
              Decode
            </button>
          </div>
        </div>

        <p className="card-description">
          {mode === "encode"
            ? "Hide secret text inside an image by encoding it in the least significant bits of pixel data."
            : "Extract hidden text from an image that contains steganographic data."}
        </p>

        <div
          className="file-upload"
          onClick={() => fileInputRef.current.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          {selectedImage ? (
            <img
              src={selectedImage.src || "/placeholder.svg"}
              alt="Selected"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          ) : (
            <>
              <ImageIcon className="nav-icon" />
              <p className="file-upload-text">Click or drag image here</p>
            </>
          )}
        </div>

        {mode === "encode" && (
          <>
            <textarea
              className="input-field textarea"
              placeholder="Enter text to hide in the image..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>

            <button className="button" onClick={encodeImage} disabled={isProcessing || !selectedImage || !text}>
              {isProcessing ? "Encoding..." : "Encode Image"}
            </button>

            {resultImage && (
              <div className="result-container">
                <h3>Encoded Image:</h3>
                <img src={resultImage || "/placeholder.svg"} alt="Encoded" style={{ maxWidth: "100%" }} />
                <button className="button" onClick={downloadImage}>
                  <DownloadIcon className="nav-icon" /> Download Encoded Image
                </button>
              </div>
            )}
          </>
        )}

        {mode === "decode" && (
          <>
            <button className="button" onClick={decodeImage} disabled={isProcessing || !selectedImage}>
              {isProcessing ? "Decoding..." : "Decode Image"}
            </button>

            {decodedText && (
              <div className="result-area">
                <h3>Decoded Text:</h3>
                <p>{decodedText}</p>
              </div>
            )}
          </>
        )}

        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  )
}

export default SteganographyTool
