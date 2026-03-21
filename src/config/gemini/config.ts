export type GeminiConfig = {
  apiKey: string;
};

export default (): GeminiConfig => ({
  apiKey: process.env.GEMINI_API_KEY!
});
