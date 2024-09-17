import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [scannedCode, setScannedCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!readerRef.current) return;

    try {
      setIsScanning(true);
      controlsRef.current = await readerRef.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          setScannedCode(result.getText());
          // stopScanning(); // Arrete le scan apres avoir trouvé un code
        }
        if (err && !(err instanceof Error)) {
          console.error("Erreur de décodage", err);
        }
      });
    } catch (err) {
      console.error("Erreur lors du démarage du scan", err);
    }
  };

  const stopScanning = () => {
    if (controlsRef.current) {
     controlsRef.current.stop();
      controlsRef.current = null; // Réinitialisez controlsRef apres l'arret
      setIsScanning(false);
    }
  };

  return (
    <div>
      <h1 className='text-2xl mt-[50px] mb-[20px] ml-[15px]'>Scanner de Code-barres</h1>
      <p className='text-gray-500 ml-[15px] mb-[25px]'>Scanner vos barre code ! </p>
      <div>
  
          <video ref={videoRef} style={{ width: '350px', height: '350px' }} />

    
      </div>

      <div>
        {!isScanning ? (
          <button className='bg-[#0084ca] p-[15px] rounded-2xl text-white mb-[35px] mt-[25px]' onClick={startScanning}>Démarrer le scan</button>
        ) : (
          <button className='bg-[#0084ca] p-[15px] rounded-2xl text-white mb-[35px] mt-[25px]' onClick={stopScanning}>Arrêter le scan</button>
        )}
      </div>
      {scannedCode && (
        <div>
          <h2 className='ml-[15px]'>Code scanné :</h2>
          {scannedCode ?
            <div className='w-[90%] m-auto flex mt-[15px]'>
              <span className='!h-[32px] w-[5px] block bg-[#0084ca]'></span>
              <span className='bg-[#a8e2ff] w-full pl-[5px] pt-[4px] pb-[4px]'><p>{scannedCode}</p></span>

            </div>
            : null}

        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;