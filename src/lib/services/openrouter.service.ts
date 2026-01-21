import axios from 'axios'
import { LLMService } from './llm.interface'
import { templateLiteral } from 'zod'

export class OpenRouterService implements LLMService {
    private client = axios.create({
        baseURL: 'https://openrouter.ai/api/v1',
        headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json'
        },
        timeout: 240000 // 4 minutes
    })
    async generate(prompt: string): Promise<string> {
        console.log('OpenRouterService generate called with this prompt:',)
        const response = await this.client.post('/chat/completions', {
            model: process.env.OLLAMA_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
                { role: 'system', content: 'You are a helpful legal assistant for contract analysis.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 8192,
            temperature: 0.2,
        })

        const content = response.data.choices[0]?.message?.content
        if (!content) {
            throw new Error('OpenRouter response format invalid')
        }
        console.log('OpenRouterService response content:', content)
        return content.trim()
    }
}