export const stripe = {
  charges: {
    create: jest.fn().mockReturnValue({
      id: 'stripe-test-id',
    }),
  },
};
