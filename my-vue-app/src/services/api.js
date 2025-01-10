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

  async handleStream(stream) {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let dataText = '';

    return new Promise((resolve, reject) => {
      reader.read().then(function processText({ done, value }) {
        if (done) {
          resolve();
          return;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.toString().split(/\r?\n/);
        lines.forEach(line => {
          if (line) {
            dataText += line;
            const response = line.slice(6);
            if (response === '[DONE]') {
              return;
            }
            const choices = JSON.parse(response.trim())?.choices?.[0];
            if (choices) {
              if (choices.finish_reason === 'stop') {
                return;
              }
              resolve(choices); // 返回选择的回复
            }
          }
        });
        reader.read().then(processText);
      }).catch(reject);
    });
  }

  cancelRequest() {
    this.controller.abort();
  }
}

