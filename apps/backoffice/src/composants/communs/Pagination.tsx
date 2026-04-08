// =============================================================================
// Composant Pagination
// =============================================================================

import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MetaPagination } from '@/types';

interface PropsPagination {
  meta: MetaPagination;
  onChangerPage: (page: number) => void;
}

export default function Pagination({ meta, onChangerPage }: PropsPagination) {
  const { page, total, total_pages, limite } = meta;
  const debut = (page - 1) * limite + 1;
  const fin = Math.min(page * limite, total);

  // Générer les numéros de page à afficher
  const genererPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (total_pages <= 7) {
      for (let i = 1; i <= total_pages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(total_pages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < total_pages - 2) pages.push('...');
      pages.push(total_pages);
    }
    return pages;
  };

  if (total_pages <= 1) return null;

  return (
    <div className="pagination">
      <span className="pagination-info">
        {debut}–{fin} sur {total} résultats
      </span>
      <div className="pagination-boutons">
        <button
          className="pagination-bouton"
          onClick={() => onChangerPage(page - 1)}
          disabled={page <= 1}
          aria-label="Page précédente"
        >
          <ChevronLeft size={16} />
        </button>
        {genererPages().map((p, i) =>
          typeof p === 'number' ? (
            <button
              key={i}
              className={`pagination-bouton ${p === page ? 'pagination-bouton--actif' : ''}`}
              onClick={() => onChangerPage(p)}
            >
              {p}
            </button>
          ) : (
            <span key={i} style={{ padding: '0 4px', color: 'var(--couleur-texte-desactive)' }}>…</span>
          )
        )}
        <button
          className="pagination-bouton"
          onClick={() => onChangerPage(page + 1)}
          disabled={page >= total_pages}
          aria-label="Page suivante"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
