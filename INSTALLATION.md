# 安装说明

## 安装依赖

在项目根目录运行以下命令安装所有依赖：

```bash
npm install
```

## 主要依赖

- **React 19** - 前端框架
- **TypeScript 5.0** - 编程语言
- **Vite 5.0** - 构建工具
- **React Router v7** - 路由管理
- **Axios** - HTTP客户端
- **Ant Design 5.12** - UI组件库
- **@ant-design/icons** - 图标库

## 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 项目特性

### 🎨 现代化UI设计
- 使用Ant Design组件库
- 渐变背景和毛玻璃效果
- 响应式设计
- 动画和过渡效果

### 🚀 功能特性
- AI图片生成
- 实时状态监控
- 图片画廊展示
- 系统健康检查

### 🛠️ 技术栈
- React 19 + TypeScript
- Vite 5.0 构建工具
- Ant Design UI组件
- Axios HTTP客户端
- ESLint + Prettier 代码规范

## 环境配置

创建 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=AI Text to Image
VITE_APP_VERSION=1.0.0
```

## 开发说明

1. 确保后端服务在 `http://localhost:8080` 运行
2. 前端服务默认运行在 `http://localhost:3000`
3. 支持热重载和快速开发
4. 代码自动格式化和检查

## 模型说明

### 支持的AI模型
- **qwen-image-plus** (推荐) - 官方推荐的高性能模型
- **qwen-image** - 基础模型，适合一般需求

### 模型选择建议
- 对于高质量图片生成，推荐使用 `qwen-image-plus`
- 对于快速生成或测试，可以使用 `qwen-image`

## 部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建完成后，`dist` 目录包含所有静态文件，可以部署到任何静态文件服务器。
