import { LAppDelegate } from '@/lib/live2d/src/lappdelegate';
import { ResourceModel } from '@/lib/protocol';

export class Live2dManager {
    public static getInstance(): Live2dManager {
        if (!this._instance) {
            this._instance = new Live2dManager();
        }
        return this._instance;
    }

    public setReady(ready: boolean) {
        this._ready = ready;
    }

    public isReady(): boolean {
        return this._ready;
    }

    public changeCharacter(character: ResourceModel | null) {
        this._ready = false;
        LAppDelegate.getInstance().changeCharacter(character);
    }

    public setLipFactor(weight: number): void {
        this._lipFactor = weight;
    }

    public getLipFactor(): number {
        return this._lipFactor;
    }

    public pushAudioQueue(audioData: ArrayBuffer): void {
        this._audioQueue.push(audioData);
    }

    public popAudioQueue(): ArrayBuffer | null {
        if (this._audioQueue.length > 0) {
            return this._audioQueue.shift() || null;
        }
        return null;
    }

    public clearAudioQueue(): void {
        this._audioQueue = [];
    }

    public playAudio(): ArrayBuffer | null {
        if (this._audioIsPlaying) return null;
        const audioData = this.popAudioQueue();
        if (audioData == null) return null;

        this._audioIsPlaying = true;
        const playAudioBuffer = (buffer: AudioBuffer) => {
            const source = this._audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this._audioContext.destination);
            source.onended = () => {
                this._audioIsPlaying = false;
            };
            source.start();
            this._audioSource = source;
        };

        const newAudioData = audioData.slice(0);
        this._audioContext.decodeAudioData(newAudioData).then(buffer => {
            playAudioBuffer(buffer);
        });
        return audioData;
    }

    public stopAudio(): void {
        this.clearAudioQueue();
        if (this._audioSource) {
            this._audioSource.stop();
            this._audioSource = null;
        }
        this._audioIsPlaying = false;
    }

    public isAudioPlaying(): boolean {
        return this._audioIsPlaying;
    }

    constructor() {
        this._audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this._audioIsPlaying = false;
        this._audioSource = null;
        this._lipFactor = 1.0;
        this._ready = false;
    }

    private static _instance: Live2dManager;
    private _audioQueue: ArrayBuffer[] = [];
    private _audioContext: AudioContext;
    private _audioIsPlaying: boolean;
    private _audioSource: AudioBufferSourceNode | null;
    private _lipFactor: number;
    private _ready: boolean;
}
