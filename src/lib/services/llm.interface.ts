export interface LLMService {
    generate(prompt: string): Promise<string>;
}