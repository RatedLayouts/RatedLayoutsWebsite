import { Outlet } from 'react-router-dom';
import BackButton from './BackButton';

const PageLayout = () => {
  return (
    <>
      <BackButton />
      <Outlet />
    </>
  );
};

export default PageLayout;
