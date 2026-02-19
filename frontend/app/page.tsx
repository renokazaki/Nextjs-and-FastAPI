"use client";

import { useState } from "react";
import SummaryForm from "@/components/SummaryForm";
import SummaryCard from "@/components/SummaryCard";

interface SummaryResult {
  title: string;
  summary: string;
  url: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Home() {
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(url: string) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail ?? "エラーが発生しました");
        return;
      }

      setResult(data as SummaryResult);
    } catch {
      setError("ネットワークエラーが発生しました。バックエンドが起動しているか確認してください。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-16">
      <div className="mx-auto max-w-2xl flex flex-col items-center gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">URL 要約アプリ</h1>
          <p className="mt-2 text-sm text-gray-500">URLを入力すると、Gemini AIがページを要約します</p>
        </div>

        {/* Form */}
        <SummaryForm onSubmit={handleSubmit} loading={loading} />

        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="h-5 w-5 animate-spin text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            ページを取得して要約中…
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Result */}
        {result && <SummaryCard {...result} />}
      </div>
    </main>
  );
}
