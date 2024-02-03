import React from 'react';
import Head from 'next/head';
import FlightList from '../components/FlightList';
import SearchBar from '../components/SearchBar';
import TitleComponent from '../components/TitleComponent';
import { observer } from 'mobx-react';
import { flightStore } from '../stores/FlightStore';
import '../styles/globals.css'; // Adjust the path according to your file structure

// The rest of your _app.js or _app.tsx file content


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
          overflow: 'auto', // This allows for scrolling without the scrollbar
          msOverflowStyle: 'none', // Hide scrollbar in IE and Edge, already covered in CSS
          scrollbarWidth: 'none', // Hide scrollbar in Firefox, already covered in CSS
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
