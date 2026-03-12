// base64转arraybuffer
export function base64ToArrayBuffer(base64String: string): ArrayBuffer {
    const binaryString = window.atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// blob转base64
export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error('Failed to read Blob as Base64'));
            }
        };
        reader.onerror = () => {
            reject(reader.error);
        };
        reader.readAsDataURL(blob);
    });
}

// 获取文件名（不含扩展名）
export function getFileNameWithoutExt(filename: string): string {
    return filename.replace(/\.[^/.]+$/, "");
}
