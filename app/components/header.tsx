'use client';

interface HeaderProps {
    onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
    return (
        <header className="h-16 w-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-between px-6 z-20">
            <h1 className="text-xl font-bold text-gray-800">Live2D Player</h1>
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenSettings}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    设置
                </button>
            </div>
        </header>
    );
}
