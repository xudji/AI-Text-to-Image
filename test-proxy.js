const axios = require('axios');

async function testProxy() {
  try {
    console.log('🧪 测试代理服务器...');
    
    // 测试健康检查
    console.log('\n1. 测试健康检查接口...');
    const healthResponse = await axios.get('http://localhost:8080/api/v1/images/health');
    console.log('✅ 健康检查成功:', healthResponse.data);
    
    // 测试图像生成接口
    console.log('\n2. 测试图像生成接口...');
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
    
    console.log('发送测试数据:', JSON.stringify(testData, null, 2));
    
    const generateResponse = await axios.post('http://localhost:8080/api/v1/images/generate', testData, {
      timeout: 60000
    });
    
    console.log('✅ 图像生成成功:', generateResponse.data);
    
  } catch (error) {
    console.error('❌ 测试失败:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('错误信息:', error.response.data);
    } else {
      console.error('错误:', error.message);
    }
  }
}

// 检查代理服务器是否运行
async function checkProxy() {
  try {
    await axios.get('http://localhost:8080/api/v1/images/health', { timeout: 5000 });
    console.log('✅ 代理服务器正在运行');
    return true;
  } catch (error) {
    console.error('❌ 代理服务器未运行，请先启动代理服务器');
    console.error('启动命令: node proxy-server.js');
    return false;
  }
}

async function main() {
  console.log('🚀 开始测试代理服务器...\n');
  
  const isRunning = await checkProxy();
  if (!isRunning) {
    process.exit(1);
  }
  
  await testProxy();
  
  console.log('\n🎉 测试完成！');
}

main();
