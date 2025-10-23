const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 8080;

// 启用CORS
app.use(cors());
app.use(express.json());

// 代理API请求到阿里云DashScope
app.post('/api/v1/images/generate', async (req, res) => {
  try {
    console.log('收到代理请求:', JSON.stringify(req.body, null, 2));
    
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      console.error('API Key未配置');
      return res.status(500).json({
        success: false,
        message: 'API Key未配置，请设置DASHSCOPE_API_KEY环境变量'
      });
    }

    // 验证请求数据
    if (!req.body || !req.body.model || !req.body.input) {
      console.error('请求数据格式错误:', req.body);
      return res.status(400).json({
        success: false,
        message: '请求数据格式错误，缺少必要参数'
      });
    }

    console.log('调用DashScope API，API Key:', apiKey.substring(0, 10) + '...');

    // 调用阿里云DashScope API
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 60000
      }
    );

    console.log('DashScope API响应:', response.data);
    
    // 转换响应格式
    if (response.data.output && response.data.output.choices && response.data.output.choices.length > 0) {
      const imageUrls = response.data.output.choices.map(choice => choice.message.content[0].image.url);
      res.json({
        success: true,
        message: '生成成功',
        imageUrls: imageUrls,
        generatedAt: new Date().toISOString(),
        requestId: response.data.request_id || Date.now().toString()
      });
    } else {
      res.json({
        success: false,
        message: response.data.message || '生成失败',
        imageUrls: [],
        generatedAt: new Date().toISOString(),
        requestId: response.data.request_id || Date.now().toString()
      });
    }
  } catch (error) {
    console.error('代理请求失败:', error);
    console.error('错误详情:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    if (error.response) {
      // 阿里云API返回的错误
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          error.response.data?.error_message ||
                          'API调用失败';
      
      console.error('阿里云API错误:', errorMessage);
      
      res.status(error.response.status).json({
        success: false,
        message: `阿里云API错误: ${errorMessage}`,
        imageUrls: [],
        generatedAt: new Date().toISOString(),
        requestId: Date.now().toString(),
        errorDetails: error.response.data
      });
    } else if (error.code === 'ECONNREFUSED') {
      res.status(500).json({
        success: false,
        message: '无法连接到阿里云服务器，请检查网络连接',
        imageUrls: [],
        generatedAt: new Date().toISOString(),
        requestId: Date.now().toString()
      });
    } else if (error.code === 'ENOTFOUND') {
      res.status(500).json({
        success: false,
        message: 'DNS解析失败，请检查网络连接',
        imageUrls: [],
        generatedAt: new Date().toISOString(),
        requestId: Date.now().toString()
      });
    } else {
      // 其他错误
      res.status(500).json({
        success: false,
        message: error.message || '未知错误',
        imageUrls: [],
        generatedAt: new Date().toISOString(),
        requestId: Date.now().toString()
      });
    }
  }
});

// 健康检查接口
app.get('/api/v1/images/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 应用信息接口
app.get('/actuator/info', (req, res) => {
  res.json({
    name: 'AI Text to Image Proxy',
    version: '1.0.0',
    description: '阿里云DashScope API代理服务',
    buildTime: new Date().toISOString()
  });
});

// 应用健康状态接口
app.get('/actuator/health', (req, res) => {
  res.json({
    status: 'UP'
  });
});

// 启动前检查API Key
const apiKey = process.env.DASHSCOPE_API_KEY;
if (!apiKey) {
  console.error('❌ 错误: 未设置DASHSCOPE_API_KEY环境变量');
  console.log('\n📝 请按以下步骤设置API Key:');
  console.log('\nWindows:');
  console.log('set DASHSCOPE_API_KEY=sk-your-actual-api-key-here');
  console.log('\nLinux/Mac:');
  console.log('export DASHSCOPE_API_KEY=sk-your-actual-api-key-here');
  console.log('\n或者运行: setup-api-key.bat (Windows)');
  process.exit(1);
}

console.log(`✅ API Key已配置: ${apiKey.substring(0, 10)}...`);

app.listen(PORT, () => {
  console.log(`🚀 代理服务器运行在 http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${apiKey.substring(0, 10)}...`);
  console.log(`🔗 前端可以访问: http://localhost:3000`);
  console.log(`📡 代理端点: http://localhost:${PORT}/api/v1/images/generate`);
});
