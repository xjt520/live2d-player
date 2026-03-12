import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { ResourceModel, ChatMessage } from '@/lib/protocol';
import * as CONSTANTS from '@/lib/constants';

// ==================== 聊天记录 ==================
interface ChatRecordState {
    chatRecord: ChatMessage[],
    addChatRecord: (message: ChatMessage) => void,
    clearChatRecord: () => void
}
export const useChatRecordStore = create<ChatRecordState>()(
    persist(
        (set) => ({
            chatRecord: [],
            addChatRecord: (message: ChatMessage) => set((state) => ({ chatRecord: [...state.chatRecord, message] })),
            clearChatRecord: () => set((state) => ({ chatRecord: [] })),
        }),
        {
            name: 'chat-record-storage'
        }
    )
)

// ==================== 基础设置 ==================
interface BasicState {
    sound: boolean,
    lipFactor: number,
    setSound: (sound: boolean) => void
    setLipFactor: (weight: number) => void
}
export const useBasicStore = create<BasicState>()(
    persist(
        (set) => ({
            sound: true,
            lipFactor: CONSTANTS.SENTIO_LIPFACTOR_DEFAULT,
            setSound: (sound: boolean) => set((state) => ({ sound: sound })),
            setLipFactor: (weight: number) => set((state) => ({ lipFactor: weight }))
        }),
        {
            name: 'basic-storage'
        }
    )
)

// ==================== 背景选择 ==================
interface BackgroundState {
    background: ResourceModel | null,
    setBackground: (background: ResourceModel | null) => void
}
export const useBackgroundStore = create<BackgroundState>()(
    persist(
        (set) => ({
            background: null,
            setBackground: (by: ResourceModel | null) => set((state) => ({ background: by })),
        }),
        {
            name: 'background-storage',
        }
    )
)

// ==================== 人物选择 ==================
interface CharacterState {
    character: ResourceModel | null,
    setCharacter: (character: ResourceModel | null) => void
}
export const useCharacterStore = create<CharacterState>()(
    persist(
        (set) => ({
            character: null,
            setCharacter: (by: ResourceModel | null) => set((state) => ({ character: by })),
        }),
        {
            name: 'character-storage',
        }
    )
)

// ==================== Live2D ==================
interface Live2DState {
    ready: boolean,
    setReady: (enable: boolean) => void
}
export const useLive2DStore = create<Live2DState>()(
    (set) => ({
        ready: false,
        setReady: (ready: boolean) => set((state) => ({ ready: ready })),
    })
)
