import React, { useEffect, useState } from 'react';
import BarcodeScannerPPC from './barcodePPC';
import Quagga from '@ericblade/quagga2';

const LogicBarreCode = ({setCodeBarrePPC}) => {
  const [scannedCode, setScannedCode] = useState('');
  const [newData, setNewData] = useState([]);
  const [numberResponseMap, setNumberResponseMap] = useState({
    goodOccurance: 0,
    badOccurance: 0
  });


  useEffect(() => {
    console.log('new data : ' +newData);
    if (scannedCode !== '' && newData.length < 40) {
      const transformedNumber = parseInt(scannedCode);
      setNewData(prevDataTest => [...prevDataTest, transformedNumber]);
    }

    if (newData.length === 40) {
      const existDouble = newData.filter((item, index) => newData.indexOf(item) !== index);
      setNumberResponseMap({
        goodOccurance: existDouble.length,
        badOccurance: 40 - existDouble.length
      });

      const calculatePourcentage = (numberResponseMap.goodOccurance * 100) / newData.length;
      console.log(calculatePourcentage);
      Quagga.stop();
    }
  }, [scannedCode, newData]);

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