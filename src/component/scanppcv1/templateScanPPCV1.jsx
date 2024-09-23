
import React, { useEffect, useState } from 'react';
import BarcodeScannerV1 from './barcodeScannerPPC1';

const TemplateBarcodeScannePPCv1 = ({ setSwitchComponent, setCodeBarrePPC }) => {
    // Stocke le code en entrée
    const [scannedCode, setScannedCode] = useState('');
    // Stocke l'enssemble des code
    const [newData, setNewData] = useState([]);
    // Stocke le nombre de bonne et de mauvaise occurance
    const [numberResponseMap, setNumberResponseMap] = useState({
        goodOccurance: 0,
        badOccurance: 0
    });
    // Stopcke le pourcentage de bonne occurance
    const [pourcentResponse, setPourcentResponse] = useState(0)
    // Stcoke l'état du scanner
    const [activateScanner, setActivateScanner] = useState(true)
    // Choix de pourcentage pour la validation des occurance
    const choicePourcent = 70;
    // Choix de la taille du tableau validant les condition
    const choiceLenghtTab = 150;
    // Déclancher quand j'ai un nouveau code 
    useEffect(() => {
        
        // Remplie un tableau de code
        if (scannedCode !== '' && newData.length < choiceLenghtTab) {
            const transformedNumber = parseInt(scannedCode);
            setNewData(prevDataTest => [...prevDataTest, transformedNumber]);
        }
         // Quand la taille du tableau est égale a choiceLenghtTab
        if (newData.length === choiceLenghtTab || newData.length >= choiceLenghtTab && activateScanner) {
            // Liste le nombre de bonne et de mauvaise occurance
            const existDouble = newData.filter((item, index) => newData.indexOf(item) !== index);
            setNumberResponseMap({
                goodOccurance: existDouble.length,
                badOccurance: choiceLenghtTab - existDouble.length

            });
           // Calculer le pourcentage de bonne occurance
            const calculatePourcentage = (existDouble.length * 100) / newData.length;
            setPourcentResponse(calculatePourcentage)
            // Quand le pourcentage de bonne occurance et supperieur au choix du pourcentage 
            if (calculatePourcentage > choicePourcent) {
                const numberCounts = {};
                let maxCount = 0;
                let maxNumber = null;
                // On bouclee sur notre tableau de résultat
                for (const num of newData) {
                    console.log(num);
                    // On regarde si la valeur de notre clef est existante pour l'incrementer ou la mettre a 1
                    numberCounts[num] ? numberCounts[num]++ : numberCounts[num] = 1;
                    // Récuperer le résultat eyant la plus grande occurance
                    if (numberCounts[num] > maxCount) {
                        maxCount = numberCounts[num];
                        maxNumber = num;
                    }
                }
                setCodeBarrePPC(maxNumber)
                setActivateScanner(false)
            }

        }
    }, [scannedCode, newData]);




    const handleDetected = (code) => {
        setScannedCode(code);
    };


    return (
        <div id='ctnScannePPCv1'>
            <BarcodeScannerV1 setSwitchComponent={setSwitchComponent} activateScanner={activateScanner} onDetected={handleDetected} />
        </div>
    );
};

export default TemplateBarcodeScannePPCv1;