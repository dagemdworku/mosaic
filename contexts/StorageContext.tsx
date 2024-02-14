// StorageContext.tsx
import React, { createContext, useState } from 'react';

interface StorageContextProps {
    endpoint: string;
    username: string;
    password: string;
    setCredentials: (endpoint: string, username: string, password: string) => void;
}

export const StorageContext = createContext<Partial<StorageContextProps>>({});

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [endpoint, setEndpoint] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const setCredentials = (newEndpoint: string, newUsername: string, newPassword: string) => {
        setEndpoint(newEndpoint);
        setUsername(newUsername);
        setPassword(newPassword);
    };

    return (
        <StorageContext.Provider value={{ endpoint, username, password, setCredentials }}>
            {children}
        </StorageContext.Provider>
    );
};