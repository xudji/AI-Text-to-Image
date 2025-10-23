# CORS跨域问题解决方案

## 🔍 问题分析

您遇到的 **403 Forbidden + OPTIONS请求** 是典型的CORS（跨域资源共享）问题：

- **浏览器安全限制**：浏览器阻止了跨域请求
- **阿里云API设计**：DashScope API设计为服务端调用，不支持浏览器直接访问
- **预检请求失败**：OPTIONS请求被服务器拒绝

## 🛠️ 解决方案：代理服务器

我已经为您创建了一个代理服务器来解决这个问题。

### 📁 新增文件

1. **`proxy-server.js`** - 代理服务器主文件
2. **`proxy-package.json`** - 代理服务器依赖配置
3. **`start-proxy.bat`** - Windows启动脚本
4. **`start-proxy.sh`** - Linux/Mac启动脚本

### 🚀 使用步骤

#### 1. 设置API Key环境变量

**Windows:**
```cmd
set DASHSCOPE_API_KEY=sk-your-actual-api-key-here
```

**Linux/Mac:**
```bash
export DASHSCOPE_API_KEY=sk-your-actual-api-key-here
```

#### 2. 安装代理服务器依赖

```bash
# 安装依赖
npm install express cors axios

# 或者使用代理服务器的package.json
cp proxy-package.json package.json
npm install
```

#### 3. 启动代理服务器

**Windows:**
```cmd
start-proxy.bat
```

**Linux/Mac:**
```bash
./start-proxy.sh
```

#### 4. 启动前端应用

```bash
npm run dev
```

### 🔧 工作原理

```
浏览器 → 前端应用 → 代理服务器 → 阿里云DashScope API
   ↑                                    ↓
   ←────────── 响应数据 ←─────────────────
```

1. **前端应用** 发送请求到 `http://localhost:8080`
2. **代理服务器** 接收请求，添加API Key认证
3. **代理服务器** 转发请求到阿里云DashScope API
4. **代理服务器** 接收响应，转换数据格式
5. **前端应用** 接收处理后的响应数据

### 📊 代理服务器功能

- ✅ **CORS支持**：解决跨域问题
- ✅ **API Key管理**：安全处理认证信息
- ✅ **数据转换**：统一响应格式
- ✅ **错误处理**：友好的错误信息
- ✅ **健康检查**：服务状态监控

### 🎯 API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/v1/images/generate` | POST | 图像生成 |
| `/api/v1/images/health` | GET | 健康检查 |
| `/actuator/info` | GET | 应用信息 |
| `/actuator/health` | GET | 应用状态 |

### 🔒 安全说明

1. **API Key保护**：API Key存储在服务器端，不会暴露给浏览器
2. **环境变量**：使用环境变量管理敏感信息
3. **本地运行**：代理服务器在本地运行，数据不会外泄

### 🐛 故障排除

#### 常见问题

1. **端口冲突**：
   - 确保8080端口未被占用
   - 可以修改`proxy-server.js`中的PORT变量

2. **API Key错误**：
   - 检查API Key是否正确设置
   - 确认API Key是否有效

3. **依赖安装失败**：
   - 检查Node.js版本（建议14+）
   - 尝试使用`npm install --force`

#### 调试方法

1. **查看代理服务器日志**：
   ```bash
   node proxy-server.js
   ```

2. **检查环境变量**：
   ```bash
   echo $DASHSCOPE_API_KEY  # Linux/Mac
   echo %DASHSCOPE_API_KEY% # Windows
   ```

3. **测试代理服务器**：
   ```bash
   curl -X GET http://localhost:8080/api/v1/images/health
   ```

### 📝 配置说明

#### 环境变量

```env
# 前端配置 (.env)
VITE_API_BASE_URL=http://localhost:8080

# 代理服务器环境变量
DASHSCOPE_API_KEY=sk-your-actual-api-key-here
```

#### 端口配置

- **前端应用**：3000端口
- **代理服务器**：8080端口
- **阿里云API**：443端口（HTTPS）

### 🎉 完成！

现在您可以：

1. 启动代理服务器（解决CORS问题）
2. 启动前端应用
3. 正常使用AI图片生成功能

代理服务器会自动处理所有跨域问题，让您的前端应用能够正常调用阿里云DashScope API！
