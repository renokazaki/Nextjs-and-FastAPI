interface SummaryCardProps {
  title: string;
  summary: string;
  url: string;
}

export default function SummaryCard({ title, summary, url }: SummaryCardProps) {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="mb-3 text-lg font-bold text-gray-900 leading-snug">{title || "（タイトルなし）"}</h2>
      <p className="mb-5 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{summary}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline break-all"
      >
        元記事を読む →
      </a>
    </div>
  );
}
