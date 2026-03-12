import { useState, useCallback, useRef, useEffect } from "react";
import { useChatRecordStore, useBasicStore } from "@/lib/store";
import { CHAT_ROLE, DialogueItem, DialogueData } from "@/lib/protocol";
import { Live2dManager } from "@/lib/live2dManager";
import { loadDialogueData, loadAudioFile } from "@/lib/dialogue";

export function useDialogue() {
    const [loading, setLoading] = useState(false);
    const [dialogueData, setDialogueData] = useState<DialogueData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { addChatRecord, clearChatRecord } = useChatRecordStore();
    const { sound } = useBasicStore();
    const controller = useRef<boolean>(false);

    // 加载对话数据
    useEffect(() => {
        loadDialogueData().then(data => {
            if (data) {
                setDialogueData(data);
            }
        });
    }, []);

    // 播放下一条对话
    const playNext = useCallback(async () => {
        if (!dialogueData || controller.current) return;
        if (currentIndex >= dialogueData.dialogues.length) {
            setCurrentIndex(0); // 循环播放
            return;
        }

        const dialogue = dialogueData.dialogues[currentIndex];
        controller.current = true;
        setLoading(true);

        // 添加聊天记录
        addChatRecord({ role: CHAT_ROLE.AI, content: dialogue.text });

        if (sound && dialogue.audio) {
            // 加载并播放音频
            try {
                const audioData = await loadAudioFile(dialogue.audio);
                if (audioData) {
                    Live2dManager.getInstance().pushAudioQueue(audioData);
                    Live2dManager.getInstance().playAudio();
                }
            } catch (e) {
                console.warn('Audio file not found:', dialogue.audio);
            }
        }

        setCurrentIndex(prev => prev + 1);
        setLoading(false);
        
        // 等待音频播放完成
        setTimeout(() => {
            controller.current = false;
        }, 1000);
    }, [dialogueData, currentIndex, addChatRecord, sound]);

    // 播放指定对话
    const playDialogue = useCallback(async (dialogue: DialogueItem) => {
        if (controller.current) return;
        controller.current = true;
        setLoading(true);

        addChatRecord({ role: CHAT_ROLE.AI, content: dialogue.text });

        if (sound && dialogue.audio) {
            try {
                const audioData = await loadAudioFile(dialogue.audio);
                if (audioData) {
                    Live2dManager.getInstance().pushAudioQueue(audioData);
                    Live2dManager.getInstance().playAudio();
                }
            } catch (e) {
                console.warn('Audio file not found:', dialogue.audio);
            }
        }

        setLoading(false);
        setTimeout(() => {
            controller.current = false;
        }, 1000);
    }, [addChatRecord, sound]);

    // 停止播放
    const stop = useCallback(() => {
        controller.current = false;
        Live2dManager.getInstance().stopAudio();
        setLoading(false);
    }, []);

    // 清空记录
    const clearRecord = useCallback(() => {
        clearChatRecord();
        setCurrentIndex(0);
    }, [clearChatRecord]);

    // 获取所有对话列表
    const getDialogueList = useCallback(() => {
        return dialogueData?.dialogues || [];
    }, [dialogueData]);

    return {
        loading,
        playNext,
        playDialogue,
        stop,
        clearRecord,
        getDialogueList,
        currentIndex,
        total: dialogueData?.dialogues.length || 0,
    };
}
