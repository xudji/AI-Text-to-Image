const axios = require('axios');

async function testApiKey() {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  
  console.log('🔍 检查API Key配置...');
  
  if (!apiKey) {
    console.error('❌ 错误: DASHSCOPE_API_KEY环境变量未设置');
    console.log('\n📝 请按以下步骤设置API Key:');
    console.log('\nWindows:');
    console.log('set DASHSCOPE_API_KEY=sk-your-actual-api-key-here');
    console.log('\nLinux/Mac:');
    console.log('export DASHSCOPE_API_KEY=sk-your-actual-api-key-here');
    console.log('\n然后重新启动代理服务器');
    return;
  }
  
  console.log('✅ API Key已设置:', apiKey.substring(0, 10) + '...');
  
  // 测试API Key是否有效
  try {
    console.log('\n🧪 测试API Key有效性...');
    
    const testData = {
      model: 'qwen-image-plus',
      input: {
        messages: [
          {
            role: 'user',
            content: [
              {
                text: '一只可爱的小猫'
              }
            ]
          }
        ]
      },
      parameters: {
        negative_prompt: '',
        size: '1328*1328',
        n: 1,
        prompt_extend: true,
        watermark: false
      }
    };
    
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
      testData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 30000
      }
    );
    
    console.log('✅ API Key有效，测试成功！');
    console.log('响应状态:', response.status);
    console.log('请求ID:', response.data.request_id);
    
  } catch (error) {
    console.error('❌ API Key测试失败:');
    
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', error.response.data);
      
      if (error.response.status === 401) {
        console.error('🔑 API Key无效或已过期，请检查您的API Key');
      } else if (error.response.status === 400) {
        console.error('📝 请求参数错误，请检查请求格式');
      } else if (error.response.status === 429) {
        console.error('⏰ 请求频率过高，请稍后重试');
      }
    } else {
      console.error('网络错误:', error.message);
    }
  }
}

testApiKey();
