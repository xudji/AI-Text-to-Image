# 直接调用阿里云DashScope API配置

## 🎯 配置说明

现在前端直接调用阿里云DashScope API，通过Vite开发服务器代理解决CORS问题。

### 🔧 配置步骤

#### 1. 设置环境变量

创建 `.env` 文件：
```env
# 阿里云DashScope API配置
VITE_DASHSCOPE_API_KEY=sk-your-actual-api-key-here

# 应用配置
VITE_APP_TITLE=AI Text to Image
VITE_APP_VERSION=1.0.0
```

#### 2. 启动应用

```bash
npm run dev
```

### 🚀 工作原理

```
浏览器 → 前端应用 → Vite代理 → 阿里云DashScope API
   ↑                                    ↓
   ←────────── 响应数据 ←─────────────────
```

1. **前端应用** 发送请求到 `/api/v1/services/aigc/multimodal-generation/generation`
2. **Vite代理** 将请求转发到 `https://dashscope.aliyuncs.com`
3. **Vite代理** 自动添加API Key认证头
4. **阿里云API** 处理请求并返回响应
5. **前端应用** 接收处理后的数据

### 📊 API调用流程

#### 请求格式
```javascript
POST /api/v1/services/aigc/multimodal-generation/generation
Content-Type: application/json
Authorization: Bearer sk-your-api-key

{
  "model": "qwen-image-plus",
  "input": {
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "text": "一只可爱的小猫"
          }
        ]
      }
    ]
  },
  "parameters": {
    "negative_prompt": "",
    "size": "1328*1328",
    "n": 1,
    "prompt_extend": true,
    "watermark": false
  }
}
```

#### 响应格式
```javascript
{
  "output": {
    "choices": [
      {
        "message": {
          "content": [
            {
              "image": {
                "url": "https://dashscope.oss-cn-beijing.aliyuncs.com/..."
              }
            }
          ]
        }
      }
    ]
  },
  "request_id": "xxx-xxx-xxx",
  "usage": {
    "image_count": 1
  }
}
```

### 🔒 安全说明

1. **API Key保护**：API Key存储在环境变量中，不会暴露给浏览器
2. **代理转发**：Vite代理自动添加认证头，前端代码不包含敏感信息
3. **本地开发**：仅在开发环境中使用，生产环境需要服务端代理

### 🐛 故障排除

#### 常见问题

1. **CORS错误**：
   - 确保使用Vite代理配置
   - 检查API Key是否正确设置

2. **401认证错误**：
   - 检查API Key是否有效
   - 确认API Key格式正确（以sk-开头）

3. **网络错误**：
   - 检查网络连接
   - 确认阿里云服务可访问

#### 调试方法

1. **检查环境变量**：
   ```bash
   echo $VITE_DASHSCOPE_API_KEY  # Linux/Mac
   echo %VITE_DASHSCOPE_API_KEY% # Windows
   ```

2. **查看网络请求**：
   - 打开浏览器开发者工具
   - 查看Network标签页的请求详情

3. **检查代理配置**：
   - 确认vite.config.ts中的代理设置
   - 检查请求URL是否正确

### 📝 注意事项

1. **开发环境专用**：此配置仅适用于开发环境
2. **生产环境**：生产环境需要服务端代理或CORS配置
3. **API Key安全**：不要将API Key提交到代码仓库
4. **费用控制**：注意API调用费用

### 🎉 完成！

现在您可以：

1. 设置API Key环境变量
2. 启动开发服务器：`npm run dev`
3. 正常使用AI图片生成功能

前端会通过Vite代理直接调用阿里云DashScope API，无需额外的代理服务器！
