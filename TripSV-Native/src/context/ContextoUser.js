import React, {createContext, useState} from 'react';

const ContextoUser = createContext(undefined);

const ProveedorContexUser = ({children}) => {
    const [user, setUser] = useState('');

    return (
        <ContextoUser.Provider value={{user, setUser}}>
            {children}
        </ContextoUser.Provider>
    );
};

export {ContextoUser, ProveedorContexUser};