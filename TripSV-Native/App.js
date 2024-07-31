import React, {useEffect} from 'react';
import {DripsyProvider, makeTheme} from "dripsy";
import TabNavigation from './src/navigation/ReactNavigation';
import {ProveedorContexto} from "./src/context/ContextoLogin";

const theme = makeTheme({
    colors: {
        primary: '#0D0B26',
        secondary: '#1a154b',
        background: '#ffffff'

    },

    // Tipografía
    typography: {
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
    },

    // Espaciado
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },

    // Bordes y sombras
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
    },
    shadows: {
        sm: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        md: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        lg: '0px 8px 16px rgba(0, 0, 0, 0.3)',
    },

})

const App = () => {

    return (
        <DripsyProvider theme={theme}>
            <ProveedorContexto>
                <TabNavigation/>
            </ProveedorContexto>
        </DripsyProvider>
    );
}

export default App;


