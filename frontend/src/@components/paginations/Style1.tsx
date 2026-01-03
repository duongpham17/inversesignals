import styles from './Style1.module.scss';
import React, { useState, ReactNode } from 'react';

interface Props<T> {
  data: T[];
  limit: number;
  children: (items: T[]) => ReactNode; // children is a function that receives the current page slice
}

const Style1 = <T,>({ data, limit, children }: Props<T>) => {
  const total = data.length;
  const total_pages = Math.ceil(total / limit);

  // Current page
  const [at, setAt] = useState(1);

  // Get current page data slice
  const startIndex = (at - 1) * limit;
  const endIndex = startIndex + limit;
  const pageData = data.slice(startIndex, endIndex);

  const direction = (dir: 'forwards' | 'backwards') => {
    if (dir === 'forwards') {
      if (at === total_pages) return;
      setAt(at + 1);
    }
    if (dir === 'backwards') {
      if (at === 1) return;
      setAt(at - 1);
    }
  };

  const showLastButton = total_pages > 5;
  const slidingLength = showLastButton ? 4 : 5;
  const start = Math.min(
    Math.max(at - 1, 1),
    Math.max(total_pages - slidingLength, 1)
  );

  if (total_pages === 0) return null;

  return (
    <div className={styles.container}>
      {/* Render the current page items */}
      {children(pageData)}

      <div className={styles.pages}>
        <button className={styles.number} onClick={() => direction('backwards')}>
          Back
        </button>

        {/* First page */}
        {start > 1 && (
          <button className={styles.number} onClick={() => setAt(1)}>
            1
          </button>
        )}

        {/* Sliding window pages */}
        {Array.from({ length: slidingLength }).map((_, i) => {
          const pageNumber = start + i;
          if (pageNumber > total_pages - (showLastButton ? 1 : 0)) return null;
          return (
            <button
              key={pageNumber}
              onClick={() => setAt(pageNumber)}
              className={`${styles.number} ${pageNumber === at ? styles.selected : ''}`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Last page */}
        {showLastButton && (
          <button
            className={`${styles.number} ${total_pages === at ? styles.selected : ''}`}
            onClick={() => setAt(total_pages)}
          >
            LAST {total_pages}
          </button>
        )}

        <button className={styles.number} onClick={() => direction('forwards')}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Style1;