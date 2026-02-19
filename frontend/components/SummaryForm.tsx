"use client";

import { FormEvent } from "react";

interface SummaryFormProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export default function SummaryForm({ onSubmit, loading }: SummaryFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const url = (form.elements.namedItem("url") as HTMLInputElement).value.trim();
    if (url) onSubmit(url);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 sm:flex-row">
      <input
        name="url"
        type="url"
        required
        placeholder="https://example.com/article"
        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:opacity-50"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? "要約中..." : "要約する"}
      </button>
    </form>
  );
}
