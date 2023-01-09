
export default {
  type: "object",
  properties: {
    card_number: { type: 'number'},
    cvv: { type: 'number',minimum:100, maximum:9999},
    expiration_month: { type: 'string',minLength: 2, maxLength: 2,pattern:'^(0[123456789]|10|11|12){1,2}$'},
    expiration_year: { type: 'string',minLength: 4, maxLength: 4},
    email: {  type: 'string',minLength: 1, maxLength: 100, pattern:'^[A-Za-z0-9+_.-]+@(.+)$'}
  },
  required: ['card_number','cvv','expiration_month','expiration_year','email'],    
} as const;
