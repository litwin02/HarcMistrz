import React, { ReactNode } from 'react';
import Header from './components/Partials/Header';
import Footer from './components/Partials/Footer';

interface LayoutProps {
    children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
