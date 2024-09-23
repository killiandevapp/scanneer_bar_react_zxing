import React, { useEffect, useState } from 'react';
import BarcodeScanner from '../component/scanPrincipal/BarcodeScanner';
//import LogicBarreCode from '../component/logicbarcodePPC';
import TemplateBarcodeScannePPCv1 from '../component/scanppcv1/templateScanPPCV1';

const TemplateScanner = () => {
    // Choisie le bon scanner
    const [switchComponent, setSwitchComponent] = useState(false);
    // Déclanche un effect dans le composant enfant
    const [triggerScanning, setTriggerScanning] = useState(true);
    const [isScanning, setIsScanning] = useState(false);
    // Stocke le premier du deuxieme code barre 
    const [scannedCode, setScannedCode] = useState(null);
    // Stocke le code du deuxieme code barre 
    const [codeBarrePPC, setCodeBarrePPC] = useState('');
    // // Etat verifiant si un code a bien etait crée
    // const [choiceScann, setChoiceScanne] = useState(false)

    //Effectue la transition entre les deux composant
    const [isLoading, setIsLoading] = useState(false);

    const triggerBtnScanner = () => {


        setTriggerScanning(!triggerScanning);
        setScannedCode(null);
        setCodeBarrePPC('');
        // Si le scanner est en mode active 
        if (!isScanning) {
            setSwitchComponent(false)
        } else {
            setSwitchComponent(undefined)
        }

    };

    return (
        <div>
            <h1 className='text-2xl mt-[25px] mb-[20px] ml-[15px]'>Scanner de Code-barres</h1>
            <p className='text-gray-500 ml-[15px] mb-[25px]'>Vérifiez votre caméra ainsi que l'éclairage pour une meilleure expérience.</p>
            {(scannedCode || codeBarrePPC) ? (
                <div className='mb-[15px]'>
                    <h2 className='ml-[15px]'>Code scanné :</h2>
                    <div className='w-[90%] m-auto flex mt-[15px]'>
                        <span className='!h-[32px] w-[5px] block bg-[#0084ca]'></span>
                        <span className='bg-[#a8e2ff] w-full pl-[5px] pt-[4px] pb-[4px]'>
                            <p>{scannedCode || codeBarrePPC}</p>
                        </span>
                    </div>
                </div>
            ) : null}
            <div className='flex justify-center'>
                <>
                   {isLoading ? (<div>Chargement en cours...</div>) 
                   : (
                    switchComponent != undefined ? (
                        switchComponent ? (
                            <TemplateBarcodeScannePPCv1
                                setSwitchComponent={setSwitchComponent}
                                setCodeBarrePPC={setCodeBarrePPC} />

                        ) : (
                            <BarcodeScanner
                                setIsLoading={setIsLoading}
                                setTriggerScanning={setTriggerScanning}
                                triggerScanning={triggerScanning}
                                scannedCode={scannedCode}
                                setScannedCode={setScannedCode}
                                setSwitchComponent={setSwitchComponent}
                                switchComponent={switchComponent}
                                setIsScanning={setIsScanning}

                            />
                        )
                    ) : null)}</>
            </div>
            <button
                className='bg-[#0084ca] p-[15px] ml-[25px] rounded-3xl text-white mb-[35px] mt-[35px]'
                onClick={triggerBtnScanner}
            >
                {triggerScanning ? 'Démarrer le scan' : 'Arrêter le scan'}
            </button>
        </div>
    );
};

export default TemplateScanner;