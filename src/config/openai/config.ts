export type OpenAIConfig = {
  apiKey: string;
};

export default (): OpenAIConfig => ({
  apiKey: process.env.OPENAI_API_KEY!
});
