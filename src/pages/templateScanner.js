// import React, { useState } from 'react';
// import BarcodeScanner from '../component/BarcodeScanner';
// import LogicBarreCode from '../component/logicbarcodePPC';
// const TemplateScanner = () => {
//     // Si false return BarcodeScanner : BarcodePPC
//     const [switchComponent, setSwitchComponent] = useState(false)
//     const [triggerScanning, setTriggerScanning] = useState(true)
//     const [isScanning, setIsScanning] = useState('')
//     const [codeBarreMultiReader, setCodeBarreMultiReader] = useState('')
//     const [codeBarrePPC, setCodeBarrePPC] = useState('')
//     const [scannedCode, setScannedCode] = useState(null);
//     console.log(scannedCode);


//     function f1(){
//         console.log(scannedCode);

//     }
//     return (
//         <div>
//             <h1 className='text-2xl mt-[25px] mb-[20px] ml-[15px]'>Scanner de Code-barres</h1>
//             <p className='text-gray-500 ml-[15px] mb-[25px]'>Verifier votre caméra ansi que l'éclairage pour une meilleur expérience.</p>
//             {scannedCode || codeBarrePPC ? (
//                 <div className='mb-[15px]'>
//                     <h2 className='ml-[15px]'>Code scanné :</h2>

//                     <div className='w-[90%] m-auto flex mt-[15px]'>
//                         <span className='!h-[32px] w-[5px] block bg-[#0084ca]'></span>
//                         <span className='bg-[#a8e2ff] w-full pl-[5px] pt-[4px] pb-[4px]'><p>{scannedCode || codeBarrePPC}</p></span>
//                     </div>

//                 </div>
//             ) : null}
//             <div className='flex justify-center'>
//                 {switchComponent === false ? (
//                     <BarcodeScanner setTriggerScanning={setTriggerScanning} triggerScanning={triggerScanning} scannedCode={scannedCode} setScannedCode={setScannedCode} setSwitchComponent={setSwitchComponent} switchComponent={switchComponent} />
//                 ) : (

//                     <LogicBarreCode setCodeBarrePPC={setCodeBarrePPC} />
//                 )}
//             </div>
//             {!isScanning ? (
//                 <button
//                     className='bg-[#0084ca] p-[15px] ml-[25px] rounded-3xl text-white mb-[35px] mt-[35px]'
//                     onClick={() => {
//                         setTriggerScanning(!triggerScanning);
//                         setScannedCode(null);
//                         setCodeBarrePPC('');  // Ajoutez cette ligne
//                         f1()
//                     }}
//                 >
//                     {triggerScanning ? 'Démarrer le scan' : 'Arrêter le scan'}
//                 </button>) : (
//                 <button className='bg-[#0084ca] p-[15px] ml-[25px] rounded-3xl text-white mb-[35px] mt-[35px]'>Arrêter le scan</button>
//             )}
//         </div>
//     )
// }
// export default TemplateScanner;


import React, { useEffect, useState } from 'react';
import BarcodeScanner from '../component/BarcodeScanner';
import LogicBarreCode from '../component/logicbarcodePPC';

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
    // Etat verifiant si un code a bien etait crée
    const [choiceScann, setChoiceScanne] = useState(false)
    console.log(switchComponent);


    // Quand la variable stockant le code change 
    useEffect(() => {
        // Si il y a un code alor on remet setTriggerScanning a true ansi que setChoiceScanne
        // setTriggerScanning va delancher le useEffect dans le composant enfant
        // setChoiceScanne va permettre au useEffect de detecter qu'il y a bien un code
        if (scannedCode) {
            setTriggerScanning(true)
            setChoiceScanne(true)
            
          
        } else {
           
        }
    }, [scannedCode])

// Déclanche une fonction qui va changer une variable et tout remmetre a 0
// Cette variable va déclancher un useEffect 
// dans le composant enfant qui a pour trigger triggerScanning
    const handleScanButtonClick = () => {
  
        
        setTriggerScanning(!triggerScanning);
        setScannedCode(null);
        setCodeBarrePPC('');
        setSwitchComponent(false)
    };

    return (
        <div>
            <h1 className='text-2xl mt-[25px] mb-[20px] ml-[15px]'>Scanner de Code-barres</h1>
            <p className='text-gray-500 ml-[15px] mb-[25px]'>Vérifiez votre caméra ainsi que l'éclairage pour une meilleure expérience.</p>
            {(scannedCode || codeBarrePPC) ?(
                <div className='mb-[15px]'>
                    <h2 className='ml-[15px]'>Code scanné :</h2>
                    <div className='w-[90%] m-auto flex mt-[15px]'>
                        <span className='!h-[32px] w-[5px] block bg-[#0084ca]'></span>
                        <span className='bg-[#a8e2ff] w-full pl-[5px] pt-[4px] pb-[4px]'>
                            <p>{scannedCode || codeBarrePPC}</p>
                        </span>
                    </div>
                </div>
            ):null}
            <div className='flex justify-center'>
            <>
            {switchComponent != undefined ? (
                switchComponent ? (
                    <p>teste</p>
                ) : (
                    <BarcodeScanner
                        setTriggerScanning={setTriggerScanning}
                        triggerScanning={triggerScanning}
                        scannedCode={scannedCode}
                        setScannedCode={setScannedCode}
                        setSwitchComponent={setSwitchComponent}
                        switchComponent={switchComponent}
                        setIsScanning={setIsScanning}
                        choiceScann={choiceScann}
                    />
                )
            ): <p>It's undefined</p>}</>
            </div>
            <button
                className='bg-[#0084ca] p-[15px] ml-[25px] rounded-3xl text-white mb-[35px] mt-[35px]'
                onClick={handleScanButtonClick}
            >
                {triggerScanning ? 'Démarrer le scan' : 'Arrêter le scan'}
            </button>
        </div>
    );
};

export default TemplateScanner;