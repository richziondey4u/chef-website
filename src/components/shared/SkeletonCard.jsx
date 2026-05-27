export default function SkeletonCard({ className = "" }) {
  return <div className={`skeleton rounded-none ${className}`} style={{ minHeight: 280 }} />;
}