import LayoutBrowser from './components/LayoutBrowser';

function Featured() {
  return (
    <div className="container">
      <h1 className="page-title">
        <img src="/RL_sparkBig.png" alt="" className="page-title-icon" />
        Featured Layouts
      </h1>
      <LayoutBrowser fetchUrl="/v1/getFeatured" />
    </div>
  );
}

export default Featured;
