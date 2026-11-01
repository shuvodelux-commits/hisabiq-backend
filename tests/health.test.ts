import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app';

describe('public health route', () => {
  it('responds without exposing tenant information', async () => {
    const response = await createApp().request('http://localhost/health');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok', service: 'hisabiq-backend' });
  });
});
