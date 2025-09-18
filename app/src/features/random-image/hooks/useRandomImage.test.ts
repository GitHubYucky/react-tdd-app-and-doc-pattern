import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRandomImage } from './useRandomImage';
import * as api from '../apis/randomImageApi';

describe('useRandomImage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('正常に画像URLを取得できる場合', async () => {
    // fetchRandomImageUrl をモック
    const mockUrl = 'https://source.unsplash.com/random/800x600';
    vi.spyOn(api, 'fetchRandomImageUrl').mockResolvedValue(mockUrl);

    const { result } = renderHook(() => useRandomImage());

    expect(result.current.imageUrl).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    // loadImageを呼ぶ
    await act(async () => {
      await result.current.loadImage();
    });

    // 期待値を検証
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.imageUrl).toBe(mockUrl);
  });

  it('画像取得でエラーが発生した場合', async () => {
    vi.spyOn(api, 'fetchRandomImageUrl').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRandomImage());

    await act(async () => {
      await result.current.loadImage();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.imageUrl).toBeNull();
    expect(result.current.error).toBe('画像の取得に失敗しました');
  });
});
