import React, { useState } from 'react';
import BarcodeScanner from '../component/BarcodeScanner';
import LogicBarreCode from '../component/logicbarcodePPC';
const TemplateScanner = () => {
    // Si false return BarcodeScanner : BarcodePPC
    const [switchComponent, setSwitchComponent] = useState(false)
    const [triggerScanning, setTriggerScanning] = useState(true)
    const [isScanning, setIsScanning] = useState('')
    const [codeBarreMultiReader, setCodeBarreMultiReader] = useState('')
    const [codeBarrePPC, setCodeBarrePPC] = useState('')
    const [scannedCode, setScannedCode] = useState('');

    console.log(scannedCode);
    
    return (
        <div>


            <h1 className='text-2xl mt-[25px] mb-[20px] ml-[15px]'>Scanner de Code-barres</h1>
            <p className='text-gray-500 ml-[15px] mb-[25px]'>Verifier votre caméra ansi que l'éclairage pour une meilleur expérience.</p>
            <div className='flex justify-center'>
                {switchComponent === false ? (
                    <BarcodeScanner triggerScanning={triggerScanning} setScannedCode={setScannedCode} setSwitchComponent={setSwitchComponent} switchComponent={switchComponent} />
                ) : (
             
                    <LogicBarreCode setCodeBarrePPC={setCodeBarrePPC} />
                )}
            </div>

            {!isScanning ? (
                <button className='bg-[#0084ca] p-[15px] ml-[25px] rounded-3xl text-white mb-[35px] mt-[35px]' onClick={() => setTriggerScanning(!triggerScanning)}>Démarrer le scan</button>
            ) : (
                <button className='bg-[#0084ca] p-[15px] ml-[25px] rounded-3xl text-white mb-[35px] mt-[35px]'>Arrêter le scan</button>
            )}

            {scannedCode || codeBarrePPC && (
                <div>
                    <h2 className='ml-[15px]'>Code scanné :</h2>

                    <div className='w-[90%] m-auto flex mt-[15px]'>
                        <span className='!h-[32px] w-[5px] block bg-[#0084ca]'></span>
                        <span className='bg-[#a8e2ff] w-full pl-[5px] pt-[4px] pb-[4px]'><p>{scannedCode || codeBarrePPC}</p></span>
                    </div>

                </div>
            )}


        </div>
    )
}


export default TemplateScanner;


