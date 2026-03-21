export type AbacatePayConfig = {
  apiKey: string;
};

export default (): AbacatePayConfig => ({
  apiKey: process.env.ABACATEPAY_API_KEY!
});
