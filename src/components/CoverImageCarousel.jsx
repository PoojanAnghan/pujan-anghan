import { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Sliding cover-image carousel.
 * - Renders a single plain image if there's only one (no controls, no overhead).
 * - Renders a swipeable/clickable slider if there are multiple images.
 *
 * Props:
 *   images        string[]  list of image URLs
 *   alt           string    alt text (post title)
 *   className     string    Tailwind classes controlling size, e.g. "h-48"
 *   showArrows    boolean   default true
 *   showDots      boolean   default true
 */
export default function CoverImageCarousel({
  images = [],
  alt = '',
  className = 'h-48',
  showArrows = true,
  showDots = true,
}) {
  const list = (images || []).filter(Boolean);
  const count = list.length;

  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const goTo = useCallback(
    (i) => {
      if (count === 0) return;
      setIndex(((i % count) + count) % count);
    },
    [count]
  );

  // stopPropagation/preventDefault matter here because these cards are
  // usually wrapped in a <Link> to the post — without this, clicking an
  // arrow or dot would also navigate away.
  const next = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    goTo(index + 1);
  };
  const prev = (e) => {
    e?.stopPropagation();
    e?.preventDefault();
    goTo(index - 1);
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const SWIPE_THRESHOLD = 40;
    if (touchDeltaX.current > SWIPE_THRESHOLD) prev(e);
    else if (touchDeltaX.current < -SWIPE_THRESHOLD) next(e);
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  if (count === 0) return null;

  return (
    <div
      className={`relative w-full overflow-hidden ${className} group/carousel`}
      onTouchStart={count > 1 ? onTouchStart : undefined}
      onTouchMove={count > 1 ? onTouchMove : undefined}
      onTouchEnd={count > 1 ? onTouchEnd : undefined}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {list.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={alt}
            className="w-full h-full flex-shrink-0 object-cover"
            draggable={false}
          />
        ))}
      </div>

      {/* Same gradient treatment already used on cover images elsewhere */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />

      {count > 1 && showArrows && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/85 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/85 text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {count > 1 && showDots && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                goTo(i);
              }}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
