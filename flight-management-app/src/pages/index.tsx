import React from 'react';
import Head from 'next/head';
import FlightList from '../components/FlightList';
import SearchBar from '../components/SearchBar';
import TitleComponent from '../components/TitleComponent';
import { observer } from 'mobx-react';
import '../styles/globals.css';

const Home = observer(() => {
  return (
    <>
      <Head>
        <title>Flight Management</title>
      </Head>
      <main
        className="flex min-h-screen flex-col items-center justify-center p-4"
        style={{
          backgroundColor: '#9798a1',
          overflow: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <TitleComponent />
        <SearchBar />
        <FlightList />
      </main>
    </>
  );
});

export default Home;
