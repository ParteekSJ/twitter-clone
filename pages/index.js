import React from "react";
import Head from "next/head";
import Sidebar from "@components/Sidebar";
import Feed from "@components/Feed";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "@components/Login";
import Modal from "@components/Modal";

import { useSelector, useDispatch } from "react-redux";
import Widgets from "@components/Widgets";

/**
 * getSession - React Hook to check if someone is signed in.
 * https://next-auth.js.org/getting-started example#frontend---add-react-hook
 */

const Home = ({ trendingResults, followResults, providers }) => {
  // important step - 2
  const { data: session } = useSession();

  const { isModalOpen } = useSelector((state) => ({ ...state.modal }));

  // Checking if there is a user signed in. If not we send them to the Login page.
  if (!session) return <Login providers={providers} />;

  return (
    <div>
      <Head>
        <title>Twitter</title>
      </Head>
      <main className="flex bg-black min-h-screen max-w-[1500px] mx-auto">
        {/* SIDEBAR - left */}
        <Sidebar />
        {/* FEED - middle */}
        <Feed />
        {/* WIDGETS - right */}
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
        {/* MODAL */}
        {isModalOpen && <Modal />}
      </main>
    </div>
  );
};

export default Home;

/**
 * Since <Sidebar /> has a position:fixed, we provide a custom width for other components
 */

export async function getServerSideProps(context) {
  const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );
  const providers = await getProviders();
  // important step - 1
  const session = await getSession(context);

  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  };
}
