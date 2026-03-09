export const toDeckSchema: Record<string, unknown> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    flashcards: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          front: { type: 'string' },
          back: { type: 'string' },
          position: { type: 'number' }
        },
        required: ['front', 'back', 'position']
      }
    }
  },
  required: ['name', 'description', 'flashcards']
};
