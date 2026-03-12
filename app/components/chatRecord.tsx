'use client';

import { useRef, useEffect, memo, useCallback } from 'react';
import { UserIcon, SunIcon } from '@heroicons/react/24/solid';
import { useChatRecordStore } from '@/lib/store';
import { CHAT_ROLE, ChatMessage } from '@/lib/protocol';
import clsx from 'clsx';

export const ChatRecord = memo(() => {
    const chatbotRef = useRef<HTMLDivElement>(null);
    const { chatRecord, clearChatRecord } = useChatRecordStore();

    useEffect(() => {
        if (chatbotRef.current) {
            chatbotRef.current.scrollTop = chatbotRef.current.scrollHeight + 100;
        }
    }, [chatRecord]);

    useEffect(() => {
        clearChatRecord();
    }, [clearChatRecord]);

    return (
        <div 
            className='flex flex-col w-full max-w-2xl space-y-4 p-3 overflow-y-auto z-10' 
            ref={chatbotRef}
            style={{ maxHeight: 'calc(100vh - 280px)' }}
        >
            {chatRecord.map((message: ChatMessage, index: number) => (
                <div key={index}>
                    <div className={clsx(
                        "flex gap-2 items-start",
                        message.role === CHAT_ROLE.HUMAN ? "justify-end" : ""
                    )}>
                        <div className={clsx(
                            "min-w-8",
                            message.role === CHAT_ROLE.HUMAN ? "text-gray-400 order-2" : "text-yellow-400 order-1"
                        )}>
                            {message.role === CHAT_ROLE.HUMAN ? (
                                <UserIcon className='size-6' />
                            ) : (
                                <SunIcon className='size-6' />
                            )}
                        </div>
                        <div className={clsx(
                            "max-w-md px-4 py-2 rounded-lg",
                            message.role === CHAT_ROLE.HUMAN 
                                ? "bg-blue-500 text-white order-1" 
                                : "bg-white/90 text-gray-800 order-2 shadow"
                        )}>
                            {message.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});
