<!-- src/App.vue -->
<template>
  <div class="chat-container">
    <div class="chat-box">
      <!-- 聊天记录 -->
      <div v-for="(message, index) in messages" :key="index" class="message">
        <span>{{ message }}</span>
      </div>
    </div>
    <div class="input-box">
      <t-input v-model="inputMessage" placeholder="输入消息..." @keyup.enter="sendMessage" />
      <t-button @click="sendMessage">发送</t-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      inputMessage: ''
    }
  },
  methods: {
    sendMessage() {
      if (this.inputMessage.trim()) {
        this.messages.push(this.inputMessage)
        this.inputMessage = ''
      }
    }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.input-box {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.message {
  margin: 5px 0;
  }
  
  @media (max-width: 600px) {
    .input-box {
      flex-direction: column;
    }
  
    .input-box>* {
      margin-bottom: 10px;
    }
  }
</style>