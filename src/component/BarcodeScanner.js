// import React, { useEffect, useRef, useState } from 'react';
// import { BrowserMultiFormatReader } from '@zxing/browser';

// const BarcodeScanner = ({ setScannedCode, triggerScanning, setSwitchComponent, switchComponent }) => {
//   const videoRef = useRef(null);
//   console.log(triggerScanning);


//   const [isScanning, setIsScanning] = useState(false);
//   const readerRef = useRef(null);
//   const controlsRef = useRef(null);
//   useEffect(() => {
//     readerRef.current = new BrowserMultiFormatReader();
//     return () => {
//       if (controlsRef.current) {
//         controlsRef.current.stop();
//       }
//     };
//   }, []);
//   useEffect(() => {
  
//     if (triggerScanning === false) {
//       startScanning()
//     }

//   }, [triggerScanning])
//   const startScanning = async () => {
//     if (!readerRef.current) return;
//     try {
//       // Ici ou autres par je voudrais effectuier une action que quand il detecte un code barre
//       // il log quelque chose, quand il detecte un code barre par quiand il arrive a lire un numero c'est possible ? 
//       setTimeout(()=>{
//         console.log('ici oon trigger');
//         stopScanning();

//         setSwitchComponent(!switchComponent)
//         return;
        
//       },3500)
//       setIsScanning(true);
//       controlsRef.current = await readerRef.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
//         if (result) {
   
//           setScannedCode(result.getText());
//           // stopScanning(); // Arrete le scan apres avoir trouvé un code
//         }
//         if (err && !(err instanceof Error)) {
//           console.error("Erreur de décodage", err);
//         }
//       });
//     } catch (err) {
//       console.error("Erreur lors du démarage du scan", err);
//     }
//   };
//   const stopScanning = () => {
//     if (controlsRef.current) {
//       controlsRef.current.stop();
//       controlsRef.current = null; // Réinitialisez controlsRef apres l'arret
//       setIsScanning(false);
//     }
//   };
//   return (
//     <div className='w-full'>

//       <video ref={videoRef} style={{ width: '450px', height: '450px' }} />

//     </div>
//   );
// };

// export default BarcodeScanner;




import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

// Composant de gestion d'erreurs
class GestionnaireDErreurs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erreurDetectee: false };
  }

  static getDerivedStateFromError(erreur) {
    return { erreurDetectee: true };
  }

  componentDidCatch(erreur, infoErreur) {
    console.log('Erreur capturée par le gestionnaire :', erreur, infoErreur);
  }

  render() {
    if (this.state.erreurDetectee) {
      return <h1>Une erreur s'est produite. Veuillez réessayer.</h1>;
    }

    return this.props.children;
  }
}

// Composant BarcodeScanner
const Barcode = ({ setScannedCode, triggerScanning, setSwitchComponent, switchComponent }) => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef(null);
  const streamRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    return () => {
      nettoyerScanner();
    };
  }, []);

  useEffect(() => {
    if (triggerScanning === false) {
      demarrerScan();
    } else {
      nettoyerScanner();
    }
  }, [triggerScanning]);

  const demarrerScan = async () => {
    if (!readerRef.current) return;
    try {
      setIsScanning(true);
      const contraintes = { video: { facingMode: 'environment' } };
      streamRef.current = await navigator.mediaDevices.getUserMedia(contraintes);
      
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play();
      }

      readerRef.current.decodeFromConstraints(
        contraintes,
        videoRef.current,
        (resultat, erreur) => {
          if (resultat) {
            console.log("Code-barres détecté !");
            setScannedCode(resultat.getText());
            nettoyerScanner();
          }
          if (erreur) {
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
    if (readerRef.current && typeof readerRef.current.reset === 'function') {
      readerRef.current.reset();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
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
    </div>
  );
};

// Composant principal qui utilise BarcodeScanner avec le gestionnaire d'erreurs
const BarcodeScanner = (props) => {
  return (
    <GestionnaireDErreurs>
      <Barcode {...props} />
    </GestionnaireDErreurs>
  );
};

export default BarcodeScanner;