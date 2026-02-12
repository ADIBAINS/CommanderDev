/** Transform backend signals to frontend format { type, count }[] */

export function transformSignals(signals: unknown): { type: string; count: number }[] {
  if (!signals || typeof signals !== "object") return [];
  const s = signals as {
    errorSpikeCount?: number;
    eventTypeFrequencies?: Record<string, number>;
  };
  const out: { type: string; count: number }[] = [];
  if (typeof s.errorSpikeCount === "number" && s.errorSpikeCount > 0) {
    out.push({ type: "ErrorSpike", count: s.errorSpikeCount });
  }
  const freqs = s.eventTypeFrequencies;
  if (freqs && typeof freqs === "object") {
    for (const [type, count] of Object.entries(freqs)) {
      if (typeof count === "number" && count > 0) out.push({ type, count });
    }
  }
  return out;
}
