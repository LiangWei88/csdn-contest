import { createApp } from 'vue'
import App from './App.vue'
import TDesign from 'tdesign-vue-next'
import TDesignChat from '@tdesign-vue-next/chat'; // 引入chat组件
import 'tdesign-vue-next/es/style/index.css'

const app = createApp(App)
app.use(TDesign).use(TDesignChat)
app.mount('#app')
