import axios, { AxiosInstance } from 'axios'

export interface OllamaOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  repeatPenalty?: number
}

export interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

export class OllamaService {
  private client: AxiosInstance
  private baseURL: string

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.OLLAMA_URL || 'http://localhost:11434'
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 600000, // 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }


  async generate(
  prompt: string,
  options: OllamaOptions = {},
  onToken?: (token: string) => void
): Promise<OllamaResponse> {
  try {
    const model = options.model || 'meta-llama/llama-3.3-70b-instruct:free';

    // on utilise fetch pour gérer le stream
    const response = await fetch(`${this.baseURL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: options.temperature ?? 0.1,
          num_predict: options.maxTokens ?? 256,
          num_ctx: 1024,
          top_p: options.topP ?? 0.9,
          repeat_penalty: options.repeatPenalty ?? 1.1,
        },
      }),
    });

    if (!response.body) throw new Error('Pas de flux disponible');

    const reader = response.body.getReader();
    let resultText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      resultText += chunk;

      // callback pour afficher les tokens au frontend
      if (onToken) onToken(chunk);
    }

    return {
      model,
      created_at: new Date().toISOString(),
      response: resultText,
      done: true,
    };
  } catch (error) {
    console.error('Ollama streaming error:', error);
    throw new Error(error instanceof Error ? error.message : 'Erreur Ollama');
  }
}



  async chat(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    options: OllamaOptions = {}
  ): Promise<OllamaResponse> {
    try {
      const response = await this.client.post<OllamaResponse>('/api/chat', {
        model: options.model || process.env.OLLAMA_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
        messages,
        stream: true,
        options: {
          temperature: options.temperature || 0.1,
          num_predict: options.maxTokens || 4096,
        },
      })

      return response.data
    } catch (error) {
      console.error('Ollama chat error:', error)
      throw new Error(`Ollama chat error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.get('/')
      return true
    } catch (error) {
      console.warn('Ollama is not available:', error)
      return false
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const response = await this.client.get<{ models: Array<{ name: string }> }>('/api/tags')
      return response.data.models.map(model => model.name)
    } catch (error) {
      console.error('Failed to list models:', error)
      return []
    }
  }
}