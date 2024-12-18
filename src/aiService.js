import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
You are an assistant that receives a random word and creates a concise hint to help the user guess this word.
- Only provide the hint, without extra words or context.
- Do not reveal the word itself or include any additional explanations or resources.
- Your response should only contain the hint, formatted as a single sentence in plain text.
Example: "Grows in soil and receives energy from the sun."
`;


const hf = new HfInference(import.meta.env.REACT_APP_API_KEY);

export async function getHintForRandomWord(word) {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", 
                  content: `Create a hint for the word: "${word}". The hint should help the user guess the word without revealing it.` },
            ],
            max_tokens: 1024,
        })
        return response.choices[0].message.content
    } catch (err) {
        console.error(err.message)
    }
}
