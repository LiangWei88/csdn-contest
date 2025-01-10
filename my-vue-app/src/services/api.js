// chatApi.js

export default class ChatApi {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.controller = new AbortController();
  }

  async fetchChatCompletions(messages, model = 'hunyuan-pro', stream = true) {
    const response = await fetch('/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ messages, model, stream }),
      signal: this.controller.signal,
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    return this.handleStream(response.body);
  }

  async *handleStream(stream) { // 使用 async * 定义 generator 函数
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // 保留未完成的行

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (line === 'data: [DONE]') break;

        const json = line.replace(/^data: /, '');
        const data = JSON.parse(json);
        const content = data.choices[0].delta.content;

        if (content) {
          yield content; // 使用 yield 逐步返回内容
        }
      }
    }
  }

  cancelRequest() {
    this.controller.abort();
  }
}