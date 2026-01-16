function GenericPage({ title }) {
  return (
    <div className="container">
      <h1 className="page-title">{title}</h1>
      <div className="glass" style={{ padding: '2rem', marginTop: '2rem' }}>
        <h1 style={{ textAlign: 'center', color: 'white' }}>
          Coming Soon...
        </h1>
      </div>
    </div>
  );
}

export default GenericPage;
