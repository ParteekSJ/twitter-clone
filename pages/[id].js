import React, { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "@components/Sidebar";
import Feed from "@components/Feed";
import { useSelector } from "react-redux";
import { useSession, getProviders, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { db } from "../firebase";
import Login from "@components/Login";
import { ArrowLeftIcon } from "@heroicons/react/solid";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import Post from "@components/Post";
import Comment from "@components/Comment";
import Modal from "@components/Modal";
import Widgets from "@components/Widgets";

export default function PostPage({
  trendingResults,
  followResults,
  providers,
}) {
  const { data: session } = useSession();
  const { isModalOpen } = useSelector((state) => ({ ...state.modal }));

  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", id), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts", id, "comments")),
        orderBy("timestamp", "desc"),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  if (!session) return <Login providers={providers} />;

  return (
    <div>
      <Head>
        <title>
          {post?.username} on Twitter: "{post?.text}"
        </title>
      </Head>
      <main className="flex bg-black min-h-screen max-w-[1500px] mx-auto">
        {/* SIDEBAR - left */}
        <Sidebar />
        {/* Comment BOX */}
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          {/* Twitter Heading */}
          <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div
              onClick={() => {
                router.push("/");
              }}
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0">
              <ArrowLeftIcon className="h-6" />
            </div>
            Tweet
          </div>
          <Post id={id} post={post} postPage />
          {comments.length > 0 && (
            <div className="pb-72">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment}
                  comment={comment.data()}
                />
              ))}
            </div>
          )}
        </div>
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
        {isModalOpen && <Modal />}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );
  const providers = await getProviders();
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
