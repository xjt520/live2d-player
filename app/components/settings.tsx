'use client';

import { useState, useEffect, memo } from 'react';
import { 
    useBackgroundStore, 
    useCharacterStore, 
    useBasicStore 
} from '@/lib/store';
import { 
    BACKGROUND_TYPE, 
    CHARACTER_TYPE, 
    RESOURCE_TYPE,
    ResourceModel 
} from '@/lib/protocol';
import * as CONSTANTS from '@/lib/constants';
import { useLive2D } from '../hooks/live2d';
import { Live2dManager } from '@/lib/live2dManager';

interface ResourceModelExtend extends ResourceModel {
    sub_type: BACKGROUND_TYPE | CHARACTER_TYPE
}

// 获取背景列表
function getBackgrounds(type: BACKGROUND_TYPE): ResourceModelExtend[] {
    const backgrounds: ResourceModelExtend[] = [];
    const images = type === BACKGROUND_TYPE.STATIC 
        ? CONSTANTS.SENTIO_BACKGROUND_STATIC_IMAGES 
        : CONSTANTS.SENTIO_BACKGROUND_DYNAMIC_IMAGES;
    const imagePath = type === BACKGROUND_TYPE.STATIC 
        ? CONSTANTS.SENTIO_BACKGROUND_STATIC_PATH 
        : CONSTANTS.SENTIO_BACKGROUND_DYNAMIC_PATH;

    for (const image of images) {
        const name = image.split('.')[0];
        backgrounds.push({
            resource_id: `${type}_${image}`,
            type: RESOURCE_TYPE.BACKGROUND,
            sub_type: type,
            name: name,
            link: `/${imagePath}/${image}`,
        });
    }
    return backgrounds;
}

// 获取人物列表
function getCharacters(type: CHARACTER_TYPE): ResourceModelExtend[] {
    const characters: ResourceModelExtend[] = [];
    const models = type === CHARACTER_TYPE.FREE 
        ? CONSTANTS.SENTIO_CHARACTER_FREE_MODELS 
        : CONSTANTS.SENTIO_CHARACTER_IP_MODELS;
    const modelPath = type === CHARACTER_TYPE.FREE 
        ? CONSTANTS.SENTIO_CHARACTER_FREE_PATH 
        : CONSTANTS.SENTIO_CHARACTER_IP_PATH;
    
    for (const model of models) {
        characters.push({
            resource_id: `${type}_${model}`,
            name: model,
            sub_type: type,
            link: `/${modelPath}/${model}/${model}.png`,
            type: RESOURCE_TYPE.CHARACTER
        });
    }
    return characters;
}

const staticBackgrounds = getBackgrounds(BACKGROUND_TYPE.STATIC);
const dynamicBackgrounds = getBackgrounds(BACKGROUND_TYPE.DYNAMIC);
const allBackgrounds = [...staticBackgrounds, ...dynamicBackgrounds];
const freeCharacters = getCharacters(CHARACTER_TYPE.FREE);
const allCharacters = [...freeCharacters];

function ImageGrid({ 
    items, 
    current, 
    onSelect,
    showType 
}: { 
    items: ResourceModelExtend[], 
    current: ResourceModel | null, 
    onSelect: (item: ResourceModelExtend) => void,
    showType: BACKGROUND_TYPE | CHARACTER_TYPE
}) {
    const filteredItems = items.filter(item => 
        showType === BACKGROUND_TYPE.ALL || 
        showType === CHARACTER_TYPE.ALL || 
        item.sub_type === showType
    );

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
            {filteredItems.map((item, index) => (
                <div
                    key={item.resource_id}
                    onClick={() => onSelect(item)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        current?.resource_id === item.resource_id 
                            ? 'border-blue-500 ring-2 ring-blue-300' 
                            : 'border-gray-200 hover:border-gray-400'
                    }`}
                >
                    {item.link.endsWith('.mp4') ? (
                        <video 
                            className="w-full h-20 object-cover"
                            autoPlay 
                            muted 
                            loop
                            src={item.link}
                        />
                    ) : (
                        <img 
                            src={item.link} 
                            alt={item.name}
                            className="w-full h-20 object-cover"
                        />
                    )}
                    <div className="p-1 text-xs text-center truncate bg-white">
                        {item.name}
                    </div>
                </div>
            ))}
        </div>
    );
}

function BackgroundsTab() {
    const { background, setBackground } = useBackgroundStore();
    const [enabled, setEnabled] = useState(background != null);
    const [bgType, setBgType] = useState<BACKGROUND_TYPE>(BACKGROUND_TYPE.ALL);

    useEffect(() => {
        setEnabled(background != null);
    }, [background]);

    const handleSelect = (item: ResourceModelExtend) => {
        setBackground(item);
        setEnabled(true);
    };

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setEnabled(checked);
        if (!checked) {
            setBackground(null);
        }
    };

    return (
        <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={enabled} 
                    onChange={handleToggle}
                    className="w-4 h-4"
                />
                <span>启用背景</span>
            </label>

            {enabled && (
                <>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setBgType(BACKGROUND_TYPE.ALL)}
                            className={`px-3 py-1 rounded text-sm ${bgType === BACKGROUND_TYPE.ALL ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >全部</button>
                        <button 
                            onClick={() => setBgType(BACKGROUND_TYPE.STATIC)}
                            className={`px-3 py-1 rounded text-sm ${bgType === BACKGROUND_TYPE.STATIC ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >静态</button>
                        <button 
                            onClick={() => setBgType(BACKGROUND_TYPE.DYNAMIC)}
                            className={`px-3 py-1 rounded text-sm ${bgType === BACKGROUND_TYPE.DYNAMIC ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >动态</button>
                    </div>
                    <ImageGrid 
                        items={allBackgrounds} 
                        current={background} 
                        onSelect={handleSelect}
                        showType={bgType}
                    />
                </>
            )}
        </div>
    );
}

function CharactersTab() {
    const { character, setCharacter } = useCharacterStore();
    const { setLive2dCharacter } = useLive2D();
    const [charType, setCharType] = useState<CHARACTER_TYPE>(CHARACTER_TYPE.ALL);

    const handleSelect = (item: ResourceModelExtend) => {
        if (character?.resource_id === item.resource_id) return;
        setCharacter(item);
        setLive2dCharacter(item);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button 
                    onClick={() => setCharType(CHARACTER_TYPE.ALL)}
                    className={`px-3 py-1 rounded text-sm ${charType === CHARACTER_TYPE.ALL ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >全部</button>
                <button 
                    onClick={() => setCharType(CHARACTER_TYPE.FREE)}
                    className={`px-3 py-1 rounded text-sm ${charType === CHARACTER_TYPE.FREE ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >免费</button>
            </div>
            <ImageGrid 
                items={allCharacters} 
                current={character} 
                onSelect={handleSelect}
                showType={charType}
            />
        </div>
    );
}

function BasicTab() {
    const { sound, lipFactor, setSound, setLipFactor } = useBasicStore();

    const handleLipFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setLipFactor(value);
        Live2dManager.getInstance().setLipFactor(value);
    };

    return (
        <div className="space-y-6">
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="checkbox" 
                    checked={sound} 
                    onChange={(e) => setSound(e.target.checked)}
                    className="w-4 h-4"
                />
                <span>启用音频</span>
            </label>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>口型幅度</span>
                    <span>{lipFactor.toFixed(1)}</span>
                </div>
                <input 
                    type="range" 
                    min={CONSTANTS.SENTIO_LIPFACTOR_MIN} 
                    max={CONSTANTS.SENTIO_LIPFACTOR_MAX} 
                    step={0.1}
                    value={lipFactor}
                    onChange={handleLipFactorChange}
                    className="w-full"
                />
            </div>
        </div>
    );
}

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'characters' | 'backgrounds' | 'basic'>('characters');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/50" 
                onClick={onClose}
            />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">设置</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >&times;</button>
                </div>

                <div className="flex border-b">
                    <button 
                        onClick={() => setActiveTab('characters')}
                        className={`flex-1 py-2 text-center ${activeTab === 'characters' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
                    >人物</button>
                    <button 
                        onClick={() => setActiveTab('backgrounds')}
                        className={`flex-1 py-2 text-center ${activeTab === 'backgrounds' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
                    >背景</button>
                    <button 
                        onClick={() => setActiveTab('basic')}
                        className={`flex-1 py-2 text-center ${activeTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
                    >基础</button>
                </div>

                <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 120px)' }}>
                    {activeTab === 'characters' && <CharactersTab />}
                    {activeTab === 'backgrounds' && <BackgroundsTab />}
                    {activeTab === 'basic' && <BasicTab />}
                </div>
            </div>
        </div>
    );
}

export default memo(SettingsModal);
