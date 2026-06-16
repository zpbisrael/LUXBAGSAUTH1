import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';

export default function Blog({ db }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'public_blogs'),
      where('platform', '==', 'LOVEFORSECOND'),
      orderBy('publishedAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div style={{ padding: 160, textAlign: 'center', color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: 24 }}>טוען כתבות...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '120px 24px 60px', color: 'var(--ivory)' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 40, color: 'var(--gold)', textAlign: 'center', marginBottom: 60 }}>
        מגזין יד שנייה ויוקרה
      </h1>
      
      {posts.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>בקרוב יעלו לכאן כתבות ומדריכים!</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {posts.map(post => (
          <article key={post.id} style={{ background: 'var(--charcoal)', border: '1px solid var(--border-dark)', padding: '40px', borderRadius: 8 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
              {post.publishedAt?.toDate?.()?.toLocaleDateString('he-IL') || ''}
            </div>
            <div style={{ lineHeight: 1.8, fontSize: 16, whiteSpace: 'pre-wrap' }}>
              {post.content}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
