export const toQuizSchema: Record<string, unknown> = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          explanation: { type: 'string' },
          position: { type: 'number' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                isCorrect: { type: 'boolean' },
                position: { type: 'number' }
              },
              required: ['text', 'isCorrect', 'position']
            }
          }
        },
        required: ['question', 'position', 'options']
      }
    }
  },
  required: ['title', 'description', 'items']
};
