import arcjet, { tokenBucket } from '@arcjet/next';

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ['userId'], // Track clerk userIds
  rules: [
    tokenBucket({
      mode: 'LIVE',
      refillRate: 20, // Refill 10 tokens per interval
      interval: 3600, // Refill every 1 hour
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});

export default aj;
