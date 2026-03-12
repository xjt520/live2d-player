// 枚举
export enum CHAT_ROLE {
    "HUMAN" = "HUMAN",
    "AI" = "AI"
}

export enum BACKGROUND_TYPE {
    "STATIC" = "STATIC",
    "DYNAMIC" = "DYNAMIC",
    "CUSTOM" = "CUSTOM",
    "ALL" = "ALL"
}

export enum CHARACTER_TYPE {
    "IP" = "IP",
    "FREE" = "FREE",
    "CUSTOM" = "CUSTOM",
    "ALL" = "ALL"
}

export enum RESOURCE_TYPE {
    "BACKGROUND" = "background",
    "CHARACTER" = "character",
    "ICON" = "icon"
}

// 接口
export interface ResourceModel {
    resource_id: string;
    name: string;
    type: RESOURCE_TYPE;
    link: string;
}

export interface ChatMessage {
    role: CHAT_ROLE;
    content: string;
}

// 对话数据格式
export interface DialogueItem {
    id: number;
    text: string;
    audio: string;
}

export interface DialogueData {
    dialogues: DialogueItem[];
}
