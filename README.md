# Live2D Player

独立的前端项目，支持预设对话播放，无需后端服务。

## 特性

- 完全独立运行，无需后端服务
- 支持预设对话数据
- 支持 Live2D 人物模型
- 支持静态/动态背景
- 支持音频播放和口型同步

## 快速开始

### 1. 安装依赖

```bash
cd live2d-player
npm install
```

### 2. 准备数据

#### 对话数据

编辑 `public/data/dialogues.json`:

```json
{
    "dialogues": [
        {
            "id": 1,
            "text": "你好，很高兴见到你！",
            "audio": "/audio/001.mp3"
        }
    ]
}
```

#### 音频文件

将音频文件放入 `public/audio/` 目录，支持 mp3、wav 格式。

### 3. 运行

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建静态站点

```bash
npm run build
```

构建产物在 `out/` 目录。

## 数据格式

### 对话数据 (dialogues.json)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 对话ID |
| text | string | 对话文本 |
| audio | string | 音频文件路径（相对于 public 目录） |

## 自定义

### 更换 Live2D 模型

将 Live2D 模型放入 `public/sentio/characters/` 目录，格式参考现有模型。

### 更换背景

- 静态背景：放入 `public/sentio/backgrounds/static/`
- 动态背景：放入 `public/sentio/backgrounds/dynamic/`

## 目录结构

```
live2d-player/
├── app/                    # 页面和组件
│   ├── components/        # React 组件
│   └── hooks/             # 自定义 Hooks
├── lib/                   # 核心库
│   ├── live2d/           # Live2D SDK
│   ├── store/            # Zustand 状态管理
│   └── dialogue.ts       # 对话数据加载
├── public/
│   ├── audio/            # 音频文件
│   ├── data/             # 对话数据
│   └── sentio/           # Live2D 模型和背景
└── package.json
```

## 注意事项

1. 音频文件格式推荐使用 WAV（16kHz, 16bit, mono）以获得最佳口型同步效果
2. 静态导出模式 (`output: 'export'`) 不支持 Next.js API 路由
3. 首次加载 Live2D 模型可能需要几秒钟
