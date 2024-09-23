import React, { useState, useEffect, useRef } from 'react';
import Quagga from '@ericblade/quagga2'; // ES6

const BarcodeScannerV1 = ({ setSwitchComponent, activateScanner, onDetected }) => {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const videoRef = useRef(null);
  const [countCapture, setCountCapture] = useState(0)



  useEffect(() => {
    if (activateScanner === true) {
      startScanning()
    } 
  }, [])

  useEffect(() => {
    if (activateScanner === true) {
      startScanning()
    } else {
      Quagga.stop();
      setSwitchComponent(undefined)
    }
  }, [activateScanner])


  useEffect(() => {
    return () => {
      if (scanning) {
        Quagga.stop();
      }
    };
  }, [scanning]);
  console.log(onDetected);


  const startScanning = () => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#ctnScannePPCv1')    // Or '#yourElement' (optional)
      },
      decoder: {
        readers: ["ean_reader", "ean_5_reader", "ean_8_reader", "code_128_reader", "code_39_reader", "code_93_reader"]
      }
    }, function (err) {
      if (err) {
        console.log(err);
        return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    });
    // Quagga.init(
    //   {
    //     inputStream: {
    //       name: "Live",
    //       type: "LiveStream",
    //       target: scannerRef.current,
    //       constraints: {
    //         width: 600,
    //         height: 400,
    //         facingMode: "environment",
    //         focusMode: "continuous" // Activer le focus manuel
    //       },
    //     },
    //     //true: Indique que Quagga doit essayer de localiser le code-barres dans l'image. Si false, Quagga suppose que le code-barres est déjà centré dans l'image, ce qui peut accélérer le traitement.
    //     locate: true,
    //     locator: {
    //       patchSize: "medium",
    //       halfSample: false,
    //     },

    //     area: { // defines rectangle of the detection/localization area
    //       top: '25%',
    //       right: '10%',
    //       left: '10%',
    //       bottom: '25%',
    //     },
    //     singleChannel: false,
    //     numOfWorkers: navigator.hardwareConcurrency || 4,
    //     decoder: {
    //       readers: [ "ean_reader","ean_8_reader", "code_128_reader", "code_39_reader", "code_93_reader"],
    //     },

    //   },
    //   function (err) {
    //     if (err) {
    //       console.log(err);
    //       return;
    //     }
    //     console.log("Initialization finished. Ready to start");
    //     Quagga.start();
    //     setScanning(true);

    //     // Stocker la référence à l'élément vidéo
    //     videoRef.current = scannerRef.current.querySelector('video');
    //   }
    // );

    Quagga.onProcessed(function (result) {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;
      //console.log(result);



      if (result) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "black", lineWidth: 2 });
        }
      }
    });


    // Quagga.onProcessed(function (result) {
    //   const drawingCtx = Quagga.canvas.ctx.overlay;
    //   const drawingCanvas = Quagga.canvas.dom.overlay;

    //   // Effacer les dessins précédents
    //   drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);

    //   // Dessiner un rectangle sombre couvrant tout le canevas
    //   drawingCtx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Couleur sombre avec transparence
    //   drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);

    //   // Calculer la zone de détection centrale
    //   const rect = {
    //     x: drawingCanvas.width * 0.1,  // 10% depuis la gauche
    //     y: drawingCanvas.height * 0.25, // 25% depuis le haut
    //     width: drawingCanvas.width * 0.8, // 80% de la largeur
    //     height: drawingCanvas.height * 0.5 // 50% de la hauteur
    //   };

    //   // Découper un trou transparent dans le rectangle sombre
    //   drawingCtx.clearRect(rect.x, rect.y, rect.width, rect.height);

    //   // Dessiner les bordures du rectangle de détection central
    //   drawingCtx.strokeStyle = 'red'; // Couleur des bordures
    //   drawingCtx.lineWidth = 2;
    //   drawingCtx.strokeRect(rect.x, rect.y, rect.width, rect.height);

    //   // Dessiner le cadre détecté si disponible
    //   if (result && result.box) {
    //     Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "black", lineWidth: 2 });
    //   }
    // });





    Quagga.onDetected(function (result) {
      console.log('BOONNNJJJOUOOUURRRR');
      onDetected(result.codeResult.code);



      // setTimeout(() => {
      //   stopScanning();
      // }, 2000);
    });
  };

  const stopScanning = () => {
    Quagga.stop();
    setScanning(false);
  };

  const toggleScanning = () => {
    if (scanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  const handleTouch = (event) => {
    if (videoRef.current && videoRef.current.srcObject) {
      const track = videoRef.current.srcObject.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      // Vérifier si le focus manuel est supporté
      if (capabilities.focusMode && capabilities.focusMode.includes('manual')) {
        const x = event.touches[0].clientX / videoRef.current.clientWidth;
        const y = event.touches[0].clientY / videoRef.current.clientHeight;

        track.applyConstraints({
          advanced: [{
            focusMode: 'manual',
            focusDistance: 0, // Vous pouvez ajuster cette valeur si nécessaire
            pointOfInterest: { x: x, y: y }
          }]
        }).catch(e => console.log("Erreur lors de l'application du focus:", e));
      }
    }
  };

  return (
    <>
      {/* <button onClick={toggleScanning}>
        {scanning ? 'Arrêter le scan' : 'Commencer le scan'}
      </button> */}
      <div
        ref={scannerRef}
        style={{ width: '100%', height: '100%', display: scanning ? 'block' : 'none' }}
        onTouchStart={handleTouch}
      >
        <canvas className="drawingBuffer" style={{
          position: 'absolute',
          top: '23%',
          bottom: '0%',
          left: '0%',
          right: '0%',
          height: '83%',
          width: '100%',
          border: '3px solid red'
        }} width="120" height="40" />
      </div>
    </>
  );
};

export default BarcodeScannerV1;