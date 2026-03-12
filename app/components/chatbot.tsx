'use client';

import { memo, useState } from "react";
import { StopCircleIcon, PlayIcon, ForwardIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { useDialogue } from "../hooks/dialogue";
import { ChatRecord } from "./chatRecord";

function DialogueList() {
    const { playDialogue, getDialogueList, currentIndex, loading } = useDialogue();
    const dialogues = getDialogueList();

    if (dialogues.length === 0) {
        return (
            <div className="text-gray-500 text-sm text-center py-4">
                暂无对话数据，请添加到 public/data/dialogues.json
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur rounded-lg p-3">
            <div className="text-sm text-gray-500 mb-2 flex justify-between items-center">
                <span>对话列表 <span className="text-blue-500">({currentIndex}/{dialogues.length})</span></span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {dialogues.map((d, idx) => (
                    <button
                        key={d.id}
                        onClick={() => playDialogue(d)}
                        disabled={loading}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                            idx === currentIndex - 1 
                                ? 'bg-blue-500 text-white border-blue-500' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {d.text.length > 15 ? d.text.substring(0, 15) + '...' : d.text}
                    </button>
                ))}
            </div>
        </div>
    );
}

function ControlButtons({ onToggleDialogueList, showDialogueList }: { onToggleDialogueList: () => void, showDialogueList: boolean }) {
    const { loading, playNext, stop, clearRecord } = useDialogue();

    return (
        <div className="flex gap-3 flex-wrap justify-center">
            <button
                onClick={playNext}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
                <PlayIcon className="size-5" />
                {loading ? '播放中...' : '播放下一条'}
            </button>
            <button
                onClick={stop}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-lg"
            >
                <StopCircleIcon className="size-5" />
                停止
            </button>
            <button
                onClick={clearRecord}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-lg"
            >
                <ForwardIcon className="size-5" />
                清空记录
            </button>
            <button
                onClick={onToggleDialogueList}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all shadow-lg"
            >
                {showDialogueList ? <ChevronDownIcon className="size-5" /> : <ChevronUpIcon className="size-5" />}
                {showDialogueList ? '隐藏列表' : '显示列表'}
            </button>
        </div>
    );
}

function ChatBot() {
    const [showDialogueList, setShowDialogueList] = useState(true);

    return (
        <div className="flex flex-col full-height-minus-64px pb-4 px-4 gap-4 justify-between items-center z-10">
            <ChatRecord />
            {showDialogueList && <DialogueList />}
            <ControlButtons 
                onToggleDialogueList={() => setShowDialogueList(!showDialogueList)} 
                showDialogueList={showDialogueList} 
            />
        </div>
    );
}

export default memo(ChatBot);
