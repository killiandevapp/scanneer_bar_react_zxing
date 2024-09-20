// BarcodeScanner.js
import React, { useState, useEffect, useRef } from 'react';
import Quagga from '@ericblade/quagga2';

const BarcodeScannerPPC = ({ onDetected }) => {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const [currentReaderIndex, setCurrentReaderIndex] = useState(0);
  const listFormat = [
    ["ean_reader","code_128_reader"]
  ];


  // const listFormat = [
  //   ["ean_reader","code_128_reader"],
  //   ["code_128_reader", "code_39_reader"],
  //   ["code_93_reader", "codabar_reader"]
  // ];
  let detectionTimer;
  let lastDetectionTime = 0;

  useEffect(() => {
    toggleScanning()
  }, [])

  useEffect(() => {
    if (scanning) {
      startScanning();
    }

    return () => {
      if (scanning) {
        Quagga.stop();
      }
    };
  }, [scanning, currentReaderIndex]);

  const startScanning = () => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: scannerRef.current,
        constraints: {
          width: 450,
          height: 330,
          facingMode: "environment"
        }
      },
      decoder: {
        readers: ["ean_reader", "code_128_reader"] // Limitez aux lecteurs nécessaires
      },
   
      locate: true,
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      frequency: 10
    }, function (err) {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    });

    Quagga.onProcessed(function (result) {
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const drawingCanvas = Quagga.canvas.dom.overlay;

      drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

      if (result && result.boxes) {
        console.log('detected');
        // const currentTime = new Date().getTime();

        // if (currentTime - lastDetectionTime > 4000) {
        //   lastDetectionTime = currentTime;
        //   clearTimeout(detectionTimer);
        //   detectionTimer = setTimeout(() => {
        //     changeReader();
        //   }, 4000);
        // }

        result.boxes.filter(box => box !== result.box).forEach(box => {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
        });
      }

      if (result && result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "red", lineWidth: 2 });
      }
    });

    Quagga.onDetected(function (result) {
      console.log('Code-barres détecté');
      clearTimeout(detectionTimer);
      onDetected(result.codeResult.code);
    });
  };

  const toggleScanning = () => {
    setScanning(!scanning);
  };

  // const changeReader = () => {
  //   Quagga.stop();
  //   setCurrentReaderIndex((prevIndex) => (prevIndex + 1) % listFormat.length);
  //   setScanning(true);
  // };
  const changeReader = () => {
    Quagga.stop();
    setCurrentReaderIndex((prevIndex) => (prevIndex + 1) % listFormat.length);
    setScanning(true);
  };

  return (
    <div>

      <div
        ref={scannerRef}
        style={{ width: '100%', height: '100%', display: scanning ? 'block' : 'none' }}
        id='barcode_scanner'
      >
        <canvas className="drawingBuffer" style={{
          position: 'absolute',
          top: '20.5%',
          bottom: '0%',
          left: '8%',
          right: '0%',
          width: '84%',
          border: '3px solid red',
          height: '63%'
        }} />
      </div>
    </div>
  );
};

export default BarcodeScannerPPC;







// import React, { useEffect, useRef, useState } from 'react';
// import { BrowserMultiFormatReader } from '@zxing/browser';
// import { BarcodeFormat, DecodeHintType } from '@zxing/library';

// const BarcodeScanner = ({ setScannedCode, triggerScanning, setSwitchComponent, switchComponent }) => {
//   const videoRef = useRef(null);
//   const [isScanning, setIsScanning] = useState(false);
//   const readerRef = useRef(null);
//   const streamRef = useRef(null);
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       nettoyerScanner();
//     };
//   }, []);

//   useEffect(() => {
//     if (triggerScanning === false) {
//       demarrerScan();
//     } else {
//       nettoyerScanner();
//     }
//   }, [triggerScanning]);

//   const demarrerScan = async () => {
  

//     const hints = new Map();
//     const formats = [
//       BarcodeFormat.EAN_13,
//       BarcodeFormat.EAN_8,
//       BarcodeFormat.CODE_128,
//       BarcodeFormat.CODE_39,
//       BarcodeFormat.CODE_93,
//       BarcodeFormat.CODABAR,
//       BarcodeFormat.QR_CODE,
//       BarcodeFormat.DATA_MATRIX
//     ];
//     hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
//     hints.set(DecodeHintType.TRY_HARDER, true);

//     readerRef.current = new BrowserMultiFormatReader(hints);
    
//     try {
//       setIsScanning(true);
//       const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
//       const selectedDeviceId = videoInputDevices[0].deviceId;

//       streamRef.current = await readerRef.current.decodeFromVideoDevice(
//         selectedDeviceId, 
//         videoRef.current, 
//         (result, error) => {
//           if (result) {
//             console.log("Code-barres détecté !");
//             setScannedCode(result.getText());
//             nettoyerScanner();
//           }
//           if (error && !(error instanceof Error)) {
//             console.log(error);
            
//             console.log("Tentative de détection d'un code-barres...");
//           }
//         }
//       );

//       timeoutRef.current = setTimeout(() => {
//         console.log('Délai dépassé');
//         nettoyerScanner();
//         setSwitchComponent(!switchComponent);
//       }, 3500);

//     } catch (err) {
//       console.error("Erreur lors du démarrage du scan", err);
//       setIsScanning(false);
//     }
//   };

//   const nettoyerScanner = () => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//     if (readerRef.current) {
//       readerRef.current.stopContinuousDecode();
//       readerRef.current = null;
//     }
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//       streamRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setIsScanning(false);
//   };

//   return (
//     <div className='w-full'>
//       <video 
//         ref={videoRef} 
//         style={{ width: '450px', height: '450px' }} 
//         autoPlay 
//         playsInline
//       />
//     </div>
//   );
// };

// export default BarcodeScanner;