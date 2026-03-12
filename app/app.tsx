'use client';

import { useEffect, useState } from "react";
import { Live2d } from './components/live2d';
import ChatBot from './components/chatbot';
import { Header } from './components/header';
import SettingsModal from './components/settings';
import { useAppConfig } from "./hooks/appConfig";

export default function App() {
    const { initApp } = useAppConfig();
    const [isLoading, setIsLoading] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    
    useEffect(() => {
        initApp();
        setIsLoading(false);
    }, []);

    return (
        <div className='w-full h-full'>
            {isLoading ? (
                <div className="w-screen h-screen flex items-center justify-center">
                    <p className="text-xl">Loading...</p>
                </div>
            ) : (
                <div className='flex flex-col w-full h-full'>
                    <Header onOpenSettings={() => setSettingsOpen(true)} />
                    <ChatBot />
                </div>
            )}
            <Live2d />
            <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
    );
}
