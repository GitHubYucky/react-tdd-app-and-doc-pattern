// src/hooks/useRandomImage.ts
import { useState, useCallback, useEffect } from 'react';
import { fetchRandomImageUrl } from '../apis/randomImageApi';

export function useRandomImage() {
  const [imageUrl, setImageUrl] = useState<string|null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = await fetchRandomImageUrl();
      setImageUrl(url);
    } catch (err) {
      setError('画像の取得に失敗しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { imageUrl, loading, error, loadImage };
}
