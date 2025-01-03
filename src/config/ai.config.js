export const AI_CONFIG = {
  BASE_URL: process.env.VUE_APP_AI_API_URL || 'https://spark-api-open.xf-yun.com/v1/chat/completions',
  API_KEY: process.env.VUE_APP_AI_API_KEY || 'c844821bb151c360b96840040731ca26',
  MODEL: {
    COMPLETION: 'Spark Max',
   
  },
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2048
} 