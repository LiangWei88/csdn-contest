<template>
  <t-chat>
    <t-chat-item
      v-for="(message, index) in messages"
      :key="message.id"
      :datetime="new Date(message.id).toLocaleTimeString()"
      avatar="https://tdesign.gtimg.com/site/avatar.jpg"
      :name="message.type === 'user' ? 'user' : 'bot'"
      role="message.type"
      :content="message.content"
      variant="text"
    />
    <t-chat-input
      v-model="inputMessage"
      placeholder="输入消息..."
      @send="sendMessage"
    />
  </t-chat>
</template>

<script setup>
import { ref } from 'vue';
import ChatApi from './services/api'; // 导入 ChatApi 类

const messages = ref([]);
const inputMessage = ref('');
const chatApi = new ChatApi('sk-6R0hq8U7v3bSbT1u41Lp6kPRwAgf9wnW73WgvSC7WUI73eRO'); // 创建 ChatApi 实例，替换为你的API密钥

const sendMessage = async () => {
  if (inputMessage.value.trim()) {
    const userMessage = { type: 'user', content: inputMessage.value, id: Date.now() };
    messages.value.push(userMessage);
    inputMessage.value = '';

    try {
      const botMessage = { type: 'bot', content: '', id: Date.now() };
      messages.value.push(botMessage);

      const stream = await chatApi.fetchChatCompletions([{ role: 'user', content: userMessage.content }]);
      for await (const chunk of stream) {
        botMessage.content += chunk;
        messages.value = [...messages.value]; // 触发响应式更新
      }
    } catch (error) {
      console.error('Error:', error);
      messages.value.push({ type: 'bot', content: '抱歉，我暂时无法回复。', id: Date.now() });
    }
  }
};
</script>

<style scoped>
.chat-container {
  height: 100vh;
}

.t-chat {
  height: 100%;
}
</style>