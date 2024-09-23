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


  const startScanning = () => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#ctnScannePPCv1')    // Or '#yourElement' (optional)
      },
      frequency: 50,
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

    Quagga.onDetected(function (result) {
      onDetected(result.codeResult.code);



      setTimeout(() => {
        stopScanning();
      }, 2000);
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