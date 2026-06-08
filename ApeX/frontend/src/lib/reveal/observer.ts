import { REVEAL_OBSERVER_OPTIONS } from "./constants";

type RevealListener = (isIntersecting: boolean) => void;

type ObserverBucket = {
  observer: IntersectionObserver;
  listeners: Map<Element, RevealListener>;
};

const buckets = new Map<string, ObserverBucket>();

function bucketKey(options: IntersectionObserverInit): string {
  const root = options.root ?? null;
  const margin = options.rootMargin ?? "";
  const threshold = Array.isArray(options.threshold)
    ? options.threshold.join(",")
    : String(options.threshold ?? 0);

  return `${root}|${margin}|${threshold}`;
}

function getBucket(options: IntersectionObserverInit): ObserverBucket {
  const key = bucketKey(options);
  let bucket = buckets.get(key);

  if (!bucket) {
    const listeners = new Map<Element, RevealListener>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        listeners.get(entry.target)?.(entry.isIntersecting);
      }
    }, options);

    bucket = { observer, listeners };
    buckets.set(key, bucket);
  }

  return bucket;
}

export function subscribeReveal(
  element: Element,
  listener: RevealListener,
  options: IntersectionObserverInit = REVEAL_OBSERVER_OPTIONS,
): () => void {
  const bucket = getBucket(options);
  bucket.listeners.set(element, listener);
  bucket.observer.observe(element);

  return () => {
    bucket.listeners.delete(element);
    bucket.observer.unobserve(element);

    if (bucket.listeners.size === 0) {
      bucket.observer.disconnect();
      buckets.delete(bucketKey(options));
    }
  };
}
