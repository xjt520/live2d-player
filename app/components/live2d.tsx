'use client';

import React, { useEffect } from 'react';
import { LAppDelegate } from '@/lib/live2d/src/lappdelegate';
import * as LAppDefine from '@/lib/live2d/src/lappdefine';
import { useBackgroundStore } from "@/lib/store";

export function Live2d() {
    const { background } = useBackgroundStore();

    const handleLoad = () => {
        if (LAppDelegate.getInstance().initialize() == false) {
            return;
        }
        LAppDelegate.getInstance().run();
    };

    const handleResize = () => {
        if (LAppDefine.CanvasSize === 'auto') {
            LAppDelegate.getInstance().onResize();
        }
    };

    const handleBeforeUnload = () => {
        LAppDelegate.releaseInstance();
    };

    useEffect(() => {
        handleLoad();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            handleBeforeUnload();
        };
    }, []);

    return (
        <div className='absolute top-0 left-0 w-full h-full z-0'>
            {background && (background.link.endsWith('.mp4') ? 
                <video 
                    className='absolute top-0 left-0 w-full h-full object-cover z-[-1]' 
                    autoPlay 
                    muted 
                    loop
                    src={background.link}
                    style={{ pointerEvents: 'none' }}
                />
                :
                <img 
                    src={background.link}
                    alt="Background"
                    className='absolute top-0 left-0 w-full h-full object-cover z-[-1]'
                />
            )}
            <canvas
                id="live2dCanvas"
                className='w-full h-full bg-center bg-cover'
            />
        </div>   
    );
}
