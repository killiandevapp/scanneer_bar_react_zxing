import React, { useEffect, useState } from 'react';
import BarcodeScannerPPC from './barcodePPC';
import Quagga from '@ericblade/quagga2';

const LogicBarreCode = ({setCodeBarrePPC}) => {
  const [scannedCode, setScannedCode] = useState('');
  const [dataTest, setDataTest] = useState([]);
  const [numberResponseMap, setNumberResponseMap] = useState({
    goodOccurance: 0,
    badOccurance: 0
  });
console.log(dataTest);

  useEffect(() => {
    if (scannedCode !== '' && dataTest.length < 50) {
      const transformedNumber = parseInt(scannedCode);
      setDataTest(prevDataTest => [...prevDataTest, transformedNumber]);
    }

    if (dataTest.length === 50) {
      const existDouble = dataTest.filter((item, index) => dataTest.indexOf(item) !== index);
      setNumberResponseMap({
        goodOccurance: existDouble.length,
        badOccurance: 50 - existDouble.length
      });

      const calculatePourcentage = (numberResponseMap.goodOccurance * 100) / dataTest.length;
      console.log(calculatePourcentage);
      Quagga.stop();
    }
  }, [scannedCode, dataTest]);

  const handleDetected = (code) => {
    setScannedCode(code);
    setCodeBarrePPC(code)
  };

  return (
    <div>
      <BarcodeScannerPPC onDetected={handleDetected} />
    </div>
  );
};

export default LogicBarreCode;