function GenericPage({ title }) {
  return (
    <div className="container">
      <h1 className="page-title">{title}</h1>
      <div className="glass" style={{ padding: '2rem', marginTop: '2rem' }}>
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Coming Soon...
        </p>
      </div>
    </div>
  );
}

export default GenericPage;
