# 阿里云DashScope API 配置说明

## 🚀 快速开始

### 1. 获取API Key

1. 访问 [阿里云百炼控制台](https://bailian.console.aliyun.com/)
2. 注册并登录您的阿里云账号
3. 在控制台中创建API Key
4. 复制您的API Key（格式类似：`sk-xxxxxxxxxxxxxxxx`）

### 2. 配置环境变量

1. 复制 `env.example` 文件为 `.env`：
   ```bash
   cp env.example .env
   ```

2. 编辑 `.env` 文件，填入您的API Key：
   ```env
   # 阿里云DashScope API配置
   VITE_DASHSCOPE_API_KEY=sk-your-actual-api-key-here
   
   # 应用配置
   VITE_APP_TITLE=AI Text to Image
   VITE_APP_VERSION=1.0.0
   ```

### 3. 启动应用

```bash
npm run dev
```

## 🎨 功能特性

### 支持的模型
- **qwen-image-plus** (推荐) - 高质量图像生成
- **qwen-image** - 基础图像生成

### 支持的图片尺寸
- 1024×1024 (1:1)
- 1328×1328 (1:1, 默认)
- 1536×1536 (1:1)
- 2048×2048 (1:1)
- 1664×928 (16:9)
- 1472×1140 (4:3)
- 1140×1472 (3:4)
- 928×1664 (9:16)

### 高级选项
- **负面提示词**: 描述不希望在图片中出现的内容
- **水印标识**: 在图片右下角添加"Qwen-Image生成"水印
- **智能改写**: 使用AI优化您的提示词，提升生成效果

## 🔧 API调用格式

### 简化模式
```javascript
{
  prompt: "一只可爱的小猫",
  size: "1328*1328",
  model: "qwen-image-plus",
  negativePrompt: "模糊, 低质量",
  watermark: false,
  promptExtend: true
}
```

### 完整模式
```javascript
{
  model: "qwen-image-plus",
  input: {
    messages: [{
      role: "user",
      content: [{
        text: "一只可爱的小猫"
      }]
    }]
  },
  parameters: {
    negative_prompt: "模糊, 低质量",
    size: "1328*1328",
    n: 1,
    prompt_extend: true,
    watermark: false
  }
}
```

## 📝 使用说明

1. **输入提示词**: 用中文或英文描述您想要的图片
2. **选择尺寸**: 根据需求选择合适的图片尺寸
3. **选择模型**: 推荐使用qwen-image-plus获得更好效果
4. **设置高级选项**: 根据需要调整水印、智能改写等选项
5. **点击生成**: 等待AI为您创作图片

## ⚠️ 注意事项

1. **API Key安全**: 请勿将API Key提交到代码仓库
2. **费用控制**: 图像生成会产生费用，请注意使用量
3. **网络要求**: 需要稳定的网络连接访问阿里云服务
4. **生成时间**: 高质量图片生成可能需要10-30秒

## 🐛 故障排除

### 常见错误

1. **401 Unauthorized**: API Key无效或过期
   - 检查API Key是否正确
   - 确认API Key是否有效

2. **400 Bad Request**: 请求参数错误
   - 检查提示词长度（不超过800字符）
   - 确认图片尺寸格式正确

3. **网络错误**: 无法连接到服务器
   - 检查网络连接
   - 确认防火墙设置

### 调试方法

1. 打开浏览器开发者工具
2. 查看Console标签页的错误信息
3. 检查Network标签页的请求详情

## 📞 技术支持

如果遇到问题，请：
1. 检查API Key配置
2. 查看浏览器控制台错误信息
3. 确认网络连接正常
4. 参考阿里云DashScope官方文档
