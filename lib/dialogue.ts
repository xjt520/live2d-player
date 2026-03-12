import { DialogueData, DialogueItem } from './protocol';

const DIALOGUE_DATA_KEY = 'live2d-dialogue-data';

// 加载本地对话数据
export async function loadDialogueData(): Promise<DialogueData | null> {
    try {
        const response = await fetch('/data/dialogues.json');
        if (!response.ok) {
            console.error('Failed to load dialogue data');
            return null;
        }
        const data: DialogueData = await response.json();
        // 缓存到 localStorage
        localStorage.setItem(DIALOGUE_DATA_KEY, JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Error loading dialogue data:', error);
        // 尝试从 localStorage 读取
        const cached = localStorage.getItem(DIALOGUE_DATA_KEY);
        if (cached) {
            return JSON.parse(cached);
        }
        return null;
    }
}

// 加载音频文件
export async function loadAudioFile(audioPath: string): Promise<ArrayBuffer | null> {
    try {
        const response = await fetch(audioPath);
        if (!response.ok) {
            console.error('Failed to load audio:', audioPath);
            return null;
        }
        return await response.arrayBuffer();
    } catch (error) {
        console.error('Error loading audio:', error);
        return null;
    }
}

// 获取所有对话
export function getAllDialogues(data: DialogueData): DialogueItem[] {
    return data.dialogues || [];
}

// 根据 ID 获取对话
export function getDialogueById(data: DialogueData, id: number): DialogueItem | undefined {
    return data.dialogues.find(d => d.id === id);
}
