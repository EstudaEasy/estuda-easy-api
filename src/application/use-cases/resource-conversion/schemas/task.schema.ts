export const toTaskSchema: Record<string, unknown> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' }
  },
  required: ['name', 'description']
};
