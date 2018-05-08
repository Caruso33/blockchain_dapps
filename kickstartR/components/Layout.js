import React, { Component, Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';
import Head from 'next/head';

const Layout = ({ children }) => {
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        />
      </Head>
      <Header />
      {children}
    </Container>
  );
};

export default Layout;
