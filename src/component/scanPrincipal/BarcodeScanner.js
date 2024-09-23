import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';


// Définition d'un composant de gestion d'erreurs
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





const Barcode = ({ setIsLoading, setTriggerScanning, setScannedCode, triggerScanning, setSwitchComponent, switchComponent }) => {
  // Réferences pour l'élément vidéo, le lecteur de codes-barres et le timeout
  const videoRef = useRef(null);
  // État pour suivre si le scan est en cours
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Effet pour démarrer ou arreter le scan en fonction de triggerScanning

  useEffect(() => {
    if (triggerScanning === false) {
      demarrerScan();
    } else {
      nettoyerScanner();
    }
    // Nettoyage lors du démontage du composant
    return () => {
      nettoyerScanner();
    };
  }, [triggerScanning]);

    // Fonction pour changer de composant apres un délai

  function functionChangeComponent() {
    console.log('Délai dépassé');
    nettoyerScanner();
    setSwitchComponent(!switchComponent);
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

  }
  // Fonction pour démarrer le scan
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
            console.log('tt');

            //setTriggerScanning(true);
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
        functionChangeComponent()

      }, 6500);

    } catch (err) {
      console.error("Erreur lors du démarrage du scan", err);
      setIsScanning(false);
    }
  };

    // Fonction pour nettoyer le scanner
  const nettoyerScanner = () => {
    console.log('Nettoyage du scanner');
    setIsScanning(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (readerRef.current) {
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
    </>
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

