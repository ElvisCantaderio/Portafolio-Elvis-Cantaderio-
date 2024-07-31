import React, {createContext, useEffect, useState} from 'react';
import {ProveedorContexUser} from "./ContextoUser";

const MiContexto = createContext(undefined);

const Idioma = createContext(undefined);

const ProveedorContexto = ({children}) => {
    const [miEstado, setMiEstado] = useState({
        logeado: false,
        role: "usuario",
    });
    const [idioma, setIdioma]= useState('es')

    return (
        <MiContexto.Provider value={{miEstado, setMiEstado}}>
            <ProveedorContexUser>
               <Idioma.Provider value={{idioma,setIdioma}} >
                   {children}
               </Idioma.Provider>

            </ProveedorContexUser>
        </MiContexto.Provider>
    );
};

export {MiContexto, ProveedorContexto,Idioma};