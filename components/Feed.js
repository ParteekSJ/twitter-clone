import React, { useState, useEffect } from "react";
import { SparklesIcon } from "@heroicons/react/outline";
import Input from "./Input";
import { db } from "../firebase";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import Post from "./Post";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [db]);

  return (
    <div className="text-white flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
      {/* HomeTitleHeader */}
      <div className="text-[#d9d9d9] flex items-center sm:justify-between py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
        <div className="hoverAnimation w-9 h-9 items-center justify-center flex xl:px-0 ml-auto">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div>
      {/* TweetInputComponent */}
      <Input />

      {/* Tweets/Posts */}
      <div className="pb-72">
        {posts.map((post) => {
          // post.id - snapshot-id
          return <Post key={post.id} id={post.id} post={post.data()} />;
        })}
      </div>
    </div>
  );
}

/**
 * flex-grow:1 - Take as much space as there is. Defines the ability for a flex item to grow if necessary.
 * sm:ml-[73px] xl:ml-[370px] <- SUPER IMPORTANT
 */
