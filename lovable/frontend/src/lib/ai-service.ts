/**
 * AI Service for code generation
 * This connects to an AI API (OpenAI, Anthropic, or local models)
 */

export interface GenerateCodeRequest {
  prompt: string;
  context?: string;
  language?: string;
  framework?: string;
}

export interface GenerateCodeResponse {
  code: string;
  explanation?: string;
  files?: Record<string, string>;
}

class AIService {
  private apiKey: string = '';
  private apiUrl: string = '';
  private provider: 'openai' | 'anthropic' | 'local' = 'local';

  constructor() {
    // Load from environment or localStorage
    if (typeof window !== 'undefined') {
      this.apiKey = localStorage.getItem('ai_api_key') || '';
      this.provider = (localStorage.getItem('ai_provider') as any) || 'local';
    }
  }

  setConfig(provider: 'openai' | 'anthropic' | 'local', apiKey?: string) {
    this.provider = provider;
    if (apiKey) {
      this.apiKey = apiKey;
      if (typeof window !== 'undefined') {
        localStorage.setItem('ai_api_key', apiKey);
        localStorage.setItem('ai_provider', provider);
      }
    }

    switch (provider) {
      case 'openai':
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        break;
      case 'anthropic':
        this.apiUrl = 'https://api.anthropic.com/v1/messages';
        break;
      case 'local':
        this.apiUrl = 'http://localhost:11434/api/generate'; // Ollama
        break;
    }
  }

  async generateCode(request: GenerateCodeRequest): Promise<GenerateCodeResponse> {
    const systemPrompt = `You are an expert software developer. Generate clean, production-ready code based on user requirements.
Always respond with complete, working code. Include necessary imports and setup.
Format: Return JSON with {code: string, explanation?: string, files?: {filename: content}}`;

    const userPrompt = `${request.prompt}
${request.context ? `\nContext: ${request.context}` : ''}
${request.language ? `\nLanguage: ${request.language}` : ''}
${request.framework ? `\nFramework: ${request.framework}` : ''}`;

    try {
      if (this.provider === 'openai') {
        return await this.generateWithOpenAI(systemPrompt, userPrompt);
      } else if (this.provider === 'anthropic') {
        return await this.generateWithAnthropic(systemPrompt, userPrompt);
      } else {
        return await this.generateWithLocal(systemPrompt, userPrompt);
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      throw new Error('Failed to generate code. Please check your API configuration.');
    }
  }

  private async generateWithOpenAI(system: string, user: string): Promise<GenerateCodeResponse> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        response_format: { type: 'json_object' }
      })
    });

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    return content;
  }

  private async generateWithAnthropic(system: string, user: string): Promise<GenerateCodeResponse> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 4096,
        system: system,
        messages: [
          { role: 'user', content: user }
        ]
      })
    });

    const data = await response.json();
    const content = JSON.parse(data.content[0].text);
    return content;
  }

  private async generateWithLocal(system: string, user: string): Promise<GenerateCodeResponse> {
    // Using Ollama as local AI
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'codellama',
        prompt: `${system}\n\nUser: ${user}\n\nAssistant:`,
        stream: false
      })
    });

    const data = await response.json();

    // Parse response - Ollama returns plain text
    try {
      const content = JSON.parse(data.response);
      return content;
    } catch {
      // If not JSON, wrap in code response
      return {
        code: data.response,
        explanation: 'Generated with local AI model'
      };
    }
  }

  async improveCode(code: string, instructions: string): Promise<string> {
    const result = await this.generateCode({
      prompt: `Improve this code according to instructions:\n\nCode:\n${code}\n\nInstructions: ${instructions}`,
      language: 'auto-detect'
    });
    return result.code;
  }

  async explainCode(code: string): Promise<string> {
    const result = await this.generateCode({
      prompt: `Explain this code in detail:\n\n${code}`
    });
    return result.explanation || result.code;
  }
}

export const aiService = new AIService();
