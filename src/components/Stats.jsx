import { useStats } from '../hooks/useStats';
import SkeletonCard from '../components/shared/SkeletonCard';

export default function Stats() {
  const { data, isLoading } = useStats();
  return (
    <section className="bg-charcoal py-16">
      <div className="max-w-7xl mx-auto px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <SkeletonCard key={i} className="h-16 opacity-20"/>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-warm-gray/20">
            {data?.map((s, i) => (
              <div key={i} className="text-center px-4">
                <div className="font-display text-4xl text-gold font-light">{s.value}</div>
                <div className="font-body text-xs text-warm-gray tracking-widest uppercase mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}