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
// import React, { useEffect, useRef, useState } from 'react';
// import { BrowserMultiFormatReader } from '@zxing/browser';


// // Composant de gestion d'erreurs
// class GestionnaireDErreurs extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { erreurDetectee: false };
//   }

//   static getDerivedStateFromError(erreur) {
//     return { erreurDetectee: true };
//   }

//   componentDidCatch(erreur, infoErreur) {
//     console.log('Erreur capturée par le gestionnaire :', erreur, infoErreur);
//   }

//   render() {
//     if (this.state.erreurDetectee) {
//       return <h1>Une erreur s'est produite. Veuillez réessayer.</h1>;
//     }

//     return this.props.children;
//   }
// }
// // Composant BarcodeScanner
// const Barcode = ({ setScannedCode, triggerScanning, setSwitchComponent, switchComponent }) => {
//   const videoRef = useRef(null);
//   const [isScanning, setIsScanning] = useState(false);
//   const readerRef = useRef(null);
//   const streamRef = useRef(null);
//   const timeoutRef = useRef(null);
//   const codeDetectedRef = useRef(false);

//   useEffect(() => {
//     readerRef.current = new BrowserMultiFormatReader();
//     return () => {
//       nettoyerScanner();
//     };
//   }, []);

//   useEffect(() => {
//     console.log('triggerScanning:', triggerScanning);

//     if (triggerScanning === false) {
//       demarrerScan();
//     } else {
//       nettoyerScanner();
//     }
//   }, [triggerScanning]);

//   const demarrerScan = async () => {
//     if (!readerRef.current) return;
//     try {
//       console.log('Démarrage du scan');

//       setScannedCode(null);
//       setIsScanning(true);
//       codeDetectedRef.current = false;
//       const contraintes = { video: { facingMode: 'environment' } };
//       streamRef.current = await navigator.mediaDevices.getUserMedia(contraintes);

//       if (videoRef.current) {
//         videoRef.current.srcObject = streamRef.current;
//         await videoRef.current.play();
//       }

//       readerRef.current.decodeFromConstraints(
//         contraintes,
//         videoRef.current,
//         (resultat, erreur) => {
//           if (resultat && !codeDetectedRef.current) {
//             codeDetectedRef.current = true;
//             console.log("Code-barres détecté :", resultat.getText());
//             setScannedCode(resultat.getText());
//             nettoyerScanner();
//             setSwitchComponent(!switchComponent);
//             if (timeoutRef.current) {
//               clearTimeout(timeoutRef.current);
//             }
//           }
//           if (erreur && !(erreur instanceof Error) && !codeDetectedRef.current) {
//             console.log("Tentative de détection d'un code-barres...");
//           }
//         }
//       );

//       timeoutRef.current = setTimeout(() => {
//         if (!codeDetectedRef.current) {
//           console.log('Délai dépassé');
//           nettoyerScanner();
//           setSwitchComponent(!switchComponent);
//         }
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
//     if (readerRef.current && typeof readerRef.current.reset === 'function') {
//       readerRef.current.reset();
//     }
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setIsScanning(false);
//     codeDetectedRef.current = false;
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

// // Composant principal qui utilise BarcodeScanner avec le gestionnaire d'erreurs
// const BarcodeScanner = (props) => {
//   return (
//     <GestionnaireDErreurs>
//       <Barcode {...props} />
//     </GestionnaireDErreurs>
//   );
// };

// export default BarcodeScanner;

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

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





const Barcode = ({ setTriggerScanning, setScannedCode, triggerScanning, setSwitchComponent, switchComponent, choiceScann }) => {
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (choiceScann === false && triggerScanning === false) {
      demarrerScan();
    } else {
      nettoyerScanner();
    }

    return () => {
      nettoyerScanner();
    };
  }, [triggerScanning, choiceScann]);

  const demarrerScan = async () => {
    try {
      console.log('Démarrage du scan');
      setIsScanning(true);

      const contraintes = { video: { facingMode: 'environment' } };
      readerRef.current = new BrowserMultiFormatReader();

      const controls = await readerRef.current.decodeFromConstraints(
        contraintes,
        videoRef.current,
        (result, error) => {
          if (result) {
            setScannedCode(result.getText());
            setTriggerScanning(true);
            setIsScanning(false); 
            setSwitchComponent(undefined);
            readerRef.current.stopContinuousDecode(); // Arrêter le scan
            return; // Sortir de la fonction de callback
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
      }, 1000500);

    } catch (err) {
      console.error("Erreur lors du démarrage du scan", err);
      setIsScanning(false);
    }
  };

  const nettoyerScanner = () => {
    console.log('Nettoyage du scanner');
    setIsScanning(false);
  
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  
    if (readerRef.current) {
      // Check if stopContinuousDecode exists, otherwise use reset
      if (typeof readerRef.current.stopContinuousDecode === 'function') {
        readerRef.current.stopContinuousDecode();
      } else if (typeof readerRef.current.reset === 'function') {
        readerRef.current.reset();
      }
      // If neither method exists, we'll just set it to null
      readerRef.current = null;
    }
  
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  return (
    <>
    <div className='w-full'>
      <video
        ref={videoRef}
        style={{ width: '450px', height: '450px' }}
        autoPlay
        playsInline
      />
    </div>
    <button onClick={demarrerScan}>fffffff</button></>
  );
};

const BarcodeScanner = (props) => {
  return (
    <>
    <GestionnaireDErreurs>
      <Barcode {...props} />
    </GestionnaireDErreurs>
    
  
    </>

  );
};

export default BarcodeScanner;


// const Barcode = ({ setTriggerScanning, scannedCode, setScannedCode, triggerScanning, setSwitchComponent, switchComponent, choiceScann }) => {
//   const videoRef = useRef(null);
//   const [isScanning, setIsScanning] = useState(false);
//   const readerRef = useRef(null);
//   const timeoutRef = useRef(null);
//   const controlsRef = useRef(null);
//   const [count, setCount] = useState(0)
//   const [bb, bbb] = useState(false)


//   // Déclanchement de fonction qui clean le scanner
//   useEffect(() => {
//     return () => {
//       nettoyerScanner();
//     };
//   }, []);
  
// // Au changement du state triggerScanning (Declancher par le composant parent)
//   useEffect(() => {
//     console.log('triggerScanning:' + triggerScanning);
//     // Verifier si un code a était trouver
//     if (choiceScann === false) {
//       if (triggerScanning === false) {
//         demarrerScan();
//       } else {
//         nettoyerScanner();
//       }

//     }
//         // Verifier si un code a était trouver
//     // Si oui on demarre le scanne 
//     // Si non on cline le scanne
//   //   if (choiceScann === false) {  
//   //     demarrerScan();
//   // }

//   }, [triggerScanning]);

//   const demarrerScan = async () => {
//     // bbb(true)
//     // console.log('start');

//     // nettoyerScanner(); // Nettoyez l'ancien lecteur s'il existe
//     readerRef.current = new BrowserMultiFormatReader();

//     try {
//       console.log('Démarrage du scan');

//       // setScannedCode();


//       // Spécifiez les contraintes pour utiliser la caméra arrière
//       const contraintes = { video: { facingMode: 'environment' } };
//       console.log(switchComponent);
//       await readerRef.current.decodeFromConstraints(
//         contraintes,
//         videoRef.current,
//         (result, error) => {
//           if (result) {
//             // Stocke le code dans scannedCode 
//             setScannedCode(result.getText());
//               console.log('kkk');
              
//             //Signale qu'on arette le scanne

//             setTriggerScanning(false)
//             setIsScanning(true);  
//             setSwitchComponent(undefined);
           
//           }
//           if (error && !(error instanceof Error)) {
//             console.log("Tentative de détection d'un code-barres...");
//           }
//         }
//       );
//       // Au bout de 4 seconde on lance notre deuxieme scanner
//       // pour les codes au format non standar
//       timeoutRef.current = setTimeout(() => {
//         console.log('Délai dépassé');
//         nettoyerScanner();
//         setSwitchComponent(!switchComponent);
//       }, 1000500);




//     } catch (err) {
//       console.error("Erreur lors du démarrage du scan", err);
//       setIsScanning(false);
//     }
//   };

//   const nettoyerScanner = () => {
//     console.log('netoyage');
//     console.log('code : ' + scannedCode);


//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//     if (controlsRef.current) {
//       controlsRef.current.stop();
//     }
//     if (readerRef.current) {
//       readerRef.current = null;
//     }
//     if (videoRef.current && videoRef.current.srcObject) {
//       videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     // setIsScanning(false);

//     // return;
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

// const BarcodeScanner = (props) => {
//   return (
//     <GestionnaireDErreurs>
//       <Barcode {...props} />
//     </GestionnaireDErreurs>
//   );
// };

// export default BarcodeScanner;
