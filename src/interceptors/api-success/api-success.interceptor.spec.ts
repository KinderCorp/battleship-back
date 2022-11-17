import { ApiSuccessInterceptor } from '@interceptors/api-success/api-success.interceptor';

describe('ApiSuccessInterceptor', () => {
  it('should be defined', () => {
    expect(new ApiSuccessInterceptor()).toBeDefined();
  });
});
