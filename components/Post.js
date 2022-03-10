import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import { close, open } from "@redux/features/modalSlice";
import { setId } from "@redux/features/postSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useSelector, useDispatch } from "react-redux";

import { db } from "../firebase";

export default function Post({ id, post, postPage }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { postId } = useSelector((state) => ({ ...state.post }));
  const { isModalOpen } = useSelector((state) => ({ ...state.modal }));
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  // FETCHING COMMENTS
  useEffect(() => {
    onSnapshot(
      query(collection(db, "posts", id, "comments")),
      orderBy("timestamp", "desc"),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [db, id]);

  // FETCHING LIKES
  useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(() => {
    // like.id IS THE USERID of the person who liked the post
    setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1);
  }, [likes]);

  const likePost = async () => {
    // like object has a value of USERID
    if (liked) {
      deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
        username: session.user.name,
      });
    }
  };

  return (
    <div
      className="p-3 flex cursor-pointer border-b border-b-gray-700"
      onClick={() => router.push(`/${id}`)}
    >
      {!postPage && (
        <img
          className="h-11 w-11 rounded-full mr-4"
          src={post?.userImg}
          alt=""
        />
      )}
      <div className="flex flex-col space-y-2 w-full">
        {/* USER DETAILS */}
        <div className={`flex ${!postPage && "justify-between"}`}>
          {postPage && (
            <img
              className="h-11 w-11 rounded-full mr-4"
              src={post?.userImg}
              alt=""
            />
          )}
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4
                className={`font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline ${
                  !postPage && "inline-block "
                }`}
              >
                {post?.username}
              </h4>
              <span
                className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}
              >
                @{post?.tag}
              </span>
            </div>{" "}
            ·{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
            </span>
            {!postPage && (
              <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                {post?.text}
              </p>
            )}
          </div>
          <div className="icon group flex-shrink-0 ml-auto">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>

        {postPage && (
          <p className="text-[#d9d9d9] mt-0.5 text-xl">{post?.text}</p>
        )}
        {/* IMAGE ASSOCIATED WITH THE TWEET */}
        <img
          src={post?.image}
          alt=""
          className="rounded-2xl max-h-[700px] object-cover mr-2"
        />

        {/* ICONS CONTAINER */}
        <div
          className={`text-[#6e767d] flex justify-between w-10/12 ${
            postPage && "mx-auto"
          }`}
        >
          {/* COMMENT ICON */}
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              isModalOpen ? dispatch(close()) : dispatch(open());
              dispatch(setId(id));
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {comments.length}
              </span>
            )}
          </div>

          {/* DELETE OR RETWEET ICON BASED*/}
          {session.user.uid === post?.id ? (
            // OWN POST - DELETE/TRASH ICON
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                // Delete the post from firebase
                deleteDoc(doc(db, "posts", id));
                router.push("/");
              }}
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            // SOMEONE ELSE'S POST - RETWEET ICON
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-500/10">
                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}

          {/* LIKE ICON */}
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likePost();
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`group-hover:text-pink-600 text-sm ${
                  liked && "text-pink-600"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          {/* SHARE ICON */}
          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          {/* CHART BAR ICON */}
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  );
}
