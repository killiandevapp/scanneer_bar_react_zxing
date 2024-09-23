import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

const Tee = () => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const readerRef = useRef(null);
  const streamRef = useRef(null);
  const timeoutRef = useRef(null);
  const [switchComponent, setSwitchComponent] = useState(false);

  useEffect(() => {
    demarrerScan();
    return () => {
      nettoyerScanner();
    };
  }, []);

  const demarrerScan = async () => {
    nettoyerScanner(); // Nettoyez l'ancien lecteur s'il existe

    const hints = new Map();
    const formats = [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_93,
      BarcodeFormat.CODABAR,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.DATA_MATRIX
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);

    readerRef.current = new BrowserMultiFormatReader(hints);
    
    try {
      setIsScanning(true);
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
      // Sélectionnez la caméra avant (généralement la dernière dans la liste)
      const selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;

      streamRef.current = await readerRef.current.decodeFromVideoDevice(
        selectedDeviceId, 
        videoRef.current, 
        (result, error) => {
          if (result) {
            console.log("Code-barres détecté !");
            setScannedCode(result.getText());
            nettoyerScanner();
          }
          if (error && !(error instanceof Error)) {
            console.log("Tentative de détection d'un code-barres...");
          }
        }
      );

      timeoutRef.current = setTimeout(() => {
        console.log('Délai dépassé');
        nettoyerScanner();
        setSwitchComponent(!switchComponent);
      }, 3500);

    } catch (err) {
      console.error("Erreur lors du démarrage du scan", err);
      setIsScanning(false);
    }
  };

  const nettoyerScanner = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (readerRef.current) {
      if (typeof readerRef.current.reset === 'function') {
        readerRef.current.reset();
      }
      readerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  return (
    <div className='w-full'>
      <video 
        ref={videoRef} 
        style={{ width: '450px', height: '450px' }} 
        autoPlay 
        playsInline
      />
      {scannedCode && <p>Code scanné : {scannedCode}</p>}
      <button onClick={demarrerScan}>Démarrer le scan</button>
      {isScanning && <p>Scan en cours...</p>}
    </div>
  );
};

export default Tee;