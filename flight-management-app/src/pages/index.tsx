import React from 'react';
import Head from 'next/head';
import FlightList from '../components/FlightList';
import SearchBar from '../components/SearchBar';
import { observer } from 'mobx-react';
import { flightStore } from '../stores/FlightStore';


const Home = observer(() => {

  return (
    <>
      <Head>
        <title>Flight Management</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <SearchBar />
        <FlightList />
      </main>
    </>
  );
});

export default Home;
