import React, { useState, useRef } from "react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";

import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";

import { useSession } from "next-auth/react";

export default function Input() {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef();
  const { data: session } = useSession();

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  /**
   * @notice Gets the file from the input(type='file')
   */
  const addImageToPost = (e) => {
    const reader = new FileReader();
    // If we've selected a file
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      // URL of the image
      setSelectedFile(readerEvent.target.result);
    };
  };

  /**
   * @notice Uploads post to firebase
   */
  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    /**
     * addDoc - allows Cloud Firestore auto-generate an ID and in our case it is stored in `docRef`
     * https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9_6
     */
    // Adding data to `posts` collection
    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp(),
    });
    console.log("POST UPLOADED");

    /**
     * ref - Returns a StorageReference for the given url.
     * https://firebase.google.com/docs/storage/web/upload-files
     */

    // Returns a reference | Uploaded image will have a name of `image` suffixed with the format of the image we upload.
    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    // Retrieving the uploadedImage downloadUrl to add to the postsCollection
    if (selectedFile) {
      /**
       * uploadString -> Uploads a string to this object's location.
       * ref[imageRef] — StorageReference where string should be uploaded.
       * value[selectedFile] — String to upload.
       * format["data_url"] — The format of the string to upload.
       */
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        console.log("POST IMAGE UPLOADED");

        // Returns the download URL for the given StorageReference.
        const downloadUrl = await getDownloadURL(imageRef);
        // Updates fields in the document referred to by the specified DocumentReference
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadUrl,
        });
        console.log("POST UPDATED WITH IMAGE LINK.");
      });
    }

    setLoading(false);
    setInput("");
    setSelectedFile(null);
    setShowEmojis(false);
  };

  return (
    <div
      className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll scrollbar-hide ${
        loading && "opacity-60"
      }`}>
      {/* Profile Image */}
      <img
        src={session.user.image}
        alt=""
        className="h-11 w-11 rounded-full cursor-pointer"
      />
      <div className="w-full divide-y divide-gray-700 text-[#d9d9d9] ">
        {/* TweetInput & SelectedImage Section */}
        <div className={`${selectedFile && "pb-7"} ${input & "space-y-2.5"} `}>
          {/* Text Area */}
          <textarea
            className="bg-transparent outline-none placeholder-gray-500 tracking-wide w-full min-h-[55px]"
            value={input}
            rows="2"
            placeholder="What's happening?"
            onChange={(e) => setInput(e.target.value)}
          />

          {/* Selected-Image-Handler */}
          {selectedFile && (
            <div className="relative">
              {/* Close Icon */}
              <div className="absolute w-8 h-8 bg-[#15181c] hover:[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer ">
                <XIcon
                  onClick={() => setSelectedFile(null)}
                  className="text-white h-5"
                />
              </div>
              {/* Selected-Image */}
              <img
                className="rounded-2xl max-h-80 object-contain"
                src={selectedFile}
                alt=""
              />
            </div>
          )}
        </div>

        {/* Twitter-Tweet-Options [Invisible once an upload is in progress.] */}
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            {/* Icons */}
            <div className="flex items-center">
              {/* Icon 1 */}
              <div
                className="icon"
                onClick={() => filePickerRef.current.click()}>
                <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
                <input
                  type="file"
                  className="hidden"
                  onChange={addImageToPost}
                  ref={filePickerRef}
                />
              </div>

              {/* Icon 2 */}
              <div className="icon rotate-90">
                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              {/* Icon 3 */}
              <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              {/* Icon 4 */}
              <div className="icon">
                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>

              {/* EmojiPicker */}
              {showEmojis && (
                <Picker
                  onSelect={addEmoji}
                  style={{
                    position: "absolute",
                    marginTop: "465px",
                    marginLeft: -40,
                    maxWidth: "320px",
                    borderRadius: "20px",
                  }}
                  theme="dark"
                />
              )}
            </div>

            {/* Tweet Button */}
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] transition ease-out duration-150 disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
              disabled={!input.trim() && !selectedFile}
              onClick={sendPost}>
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The only reason we add an <input /> field is because it is a file picker
 * Input(type=file) has a reference has a `filePickerRef` and we use this ref in our <div> as a pointer AND HENCE WHEN WE CLICK THE div we can trigger the input.
 */
