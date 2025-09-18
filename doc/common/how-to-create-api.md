# API 構築の手順 (サンプル: ランダム画像 API)

このドキュメントでは、API を構築する際の手順を抽象的に説明し、ランダム画像 API をサンプルとして具体的に解説します。

## 2. データモデル設計

- API で使用するデータの構造を定義します。
  - サンプル: 画像 URL は文字列なので、特に複雑なデータモデルは不要。
- データベースを使用する場合は、テーブルの設計を行います。
  - サンプル: 今回はデータベースを使用しない。
- TypeScript などの型付き言語を使用する場合は、インターフェースや型を定義します。
  - サンプル: レスポンスの型を定義する:

TODO:Type

```typescript
// types/random-image-type.ts
interface RandomImageResponse {
  imageUrl: string;
}
```

## 3. API ロジック実装

- リクエストを受け取り、必要な処理を実行する関数を実装します。
  - サンプル: `randomImageHandler` 関数を実装する。
- データベースへのアクセス、外部 API との連携などを行います。
  - サンプル: 外部 API (https://picsum.photos/800) から画像 URL を取得する。

```typescript
// apis/randomImageApi.ts
import type { Request, Response } from "express";

export const randomImageHandler = async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const imageUrl = await fetchRandomImageUrl();
    return res.status(200).json({ imageUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch random image" });
  }
};

async function fetchRandomImageUrl(): Promise<string> {
  const response = await fetch("https://picsum.photos/800");
  return response.url;
}
```

- エラー処理を適切に行い、エラー発生時には適切なエラーコードとメッセージを返します。
  - サンプル: 外部 API の呼び出しに失敗した場合、500 Internal Server Error を返す。

## 4. Hook で使う

```typescript
// src/hooks/useRandomImage.ts
import { useState, useCallback, useEffect } from "react";
import { fetchRandomImageUrl } from "../apis/randomImageApi";

export function useRandomImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = await fetchRandomImageUrl();
      setImageUrl(url);
    } catch (err) {
      setError("画像の取得に失敗しました");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { imageUrl, loading, error, loadImage };
}
```

## 5. テスト

- API が期待通りに動作するかをテストします。
  - サンプル: `randomImageHandler` 関数が正常に画像 URL を返すことをテストする。
- 単体テスト、結合テスト、E2E テストなどを行います。
  - サンプル: Jest などのテストフレームワークを使用して、単体テストを記述する。
- 様々な入力パターンを試し、エラー処理が正しく行われるかを確認します。
  - サンプル: 外部 API が利用できない場合に、エラーが正しく処理されることを確認する。

```typescript
// import needed plugins
import * as randomImageApi from "./randomImageApi"; // ★モジュール全体をimport
import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";
import bodyParser from "body-parser";

// ready
const app = express();
app.use(bodyParser.json());
// when you access api/random-image, then your req should be handled by randomImageHandler
app.all("/api/random-image", randomImageApi.randomImageHandler);

describe("randomImageHandler", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("POSTで正常に画像URLを返す", async () => {
    // モジュールオブジェクトとプロパティ名を指定する

    const res = await request(app).post("/api/random-image").send({});

    expect(res.status).toBe(200);
    expect(res.body.imageUrl).contain("picsum.photos");
  });
});
```
