// StorageContext.tsx
import React, { createContext, useState } from 'react';


interface StorageContextProps {
    endpoint: string;
    username: string;
    password: string;
    connected: boolean;
    setCredentials: (endpoint: string, username: string, password: string) => void;
    setConnected: (connected: boolean) => void;
}

export const StorageContext = createContext<Partial<StorageContextProps>>({});

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    console.log('Default Endpoint', process.env.DEFAULT_ENDPOINT);

    const [endpoint, setEndpoint] = useState(process.env.DEFAULT_ENDPOINT ?? '');
    const [username, setUsername] = useState(process.env.DEFAULT_USERNAME ?? '');
    const [password, setPassword] = useState(process.env.DEFAULT_PASSWORD ?? '');
    const [connected, setConnected] = useState(false);

    const setCredentials = (newEndpoint: string, newUsername: string, newPassword: string) => {
        setEndpoint(newEndpoint);
        setUsername(newUsername);
        setPassword(newPassword);
    };

    return (
        <StorageContext.Provider value={{ endpoint, username, password, connected, setCredentials, setConnected }}>
            {children}
        </StorageContext.Provider>
    );
};