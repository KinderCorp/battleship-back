import User from '@controllers/user.controller';

describe('User', () => {
  it('should be defined', () => {
    expect(new User()).toBeDefined();
  });
});
