# API 集成说明

## 后端接口配置

本项目已配置好与后端API的集成，支持以下接口：

### 1. 图像生成接口
- **URL**: `POST /api/v1/images/generate`
- **请求体**:
```json
{
  "prompt": "一只可爱的小猫",
  "width": 512,
  "height": 512,
  "numImages": 1,
  "quality": "standard"
}
```

### 2. 健康检查接口
- **URL**: `GET /api/v1/images/health`
- **响应**: 服务健康状态信息

### 3. 应用信息接口
- **URL**: `GET /actuator/info`
- **响应**: 应用基本信息

### 4. 健康状态接口
- **URL**: `GET /actuator/health`
- **响应**: 应用健康状态

## 前端配置

### 环境变量
在项目根目录创建 `.env` 文件：
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=AI Text to Image
VITE_APP_VERSION=1.0.0
```

### API客户端配置
- 基础URL: `http://localhost:8080`
- 超时时间: 30秒（图像生成需要更长时间）
- 自动错误处理
- 请求/响应拦截器

## 功能页面

### 1. 生成页面 (`/generate`)
- 文本输入框
- 图片尺寸设置（宽度×高度）
- 图片质量选择（标准/高清）
- 实时生成状态显示
- 生成结果展示

### 2. 系统状态页面 (`/status`)
- 服务健康状态监控
- 应用信息展示
- 运行时间统计

### 3. 画廊页面 (`/gallery`)
- 生成图片展示（待实现）
- 图片管理功能

## 使用方法

1. **启动后端服务**:
```bash
mvn spring-boot:run
```

2. **安装前端依赖**:
```bash
npm install
```

3. **启动前端开发服务器**:
```bash
npm run dev
```

4. **访问应用**: `http://localhost:3000`

## 开发说明

### API服务层
- `src/api/client.ts` - Axios客户端配置
- `src/api/imageService.ts` - 图片相关API服务

### 类型定义
- `src/types/index.ts` - 通用类型定义
- `src/vite-env.d.ts` - Vite环境变量类型

### 自定义Hooks
- `src/hooks/useApi.ts` - API调用Hook，支持加载状态和错误处理

### 工具函数
- `src/utils/index.ts` - 通用工具函数

## 错误处理

- 网络错误自动重试
- 超时错误处理
- 用户友好的错误提示
- 生成状态实时反馈

## 注意事项

1. 确保后端服务在 `http://localhost:8080` 运行
2. 图像生成可能需要较长时间，请耐心等待
3. 建议使用现代浏览器以获得最佳体验
4. 生产环境请配置正确的API基础URL
