
export default {
  type: "object",
  properties: {    
    token: { type: 'string',minLength: 16, maxLength: 16,pattern:'^[a-zA-Z0-9_]*$'}    
  },
  required: ['token'],
} as const;
