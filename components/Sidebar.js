import React from "react";
import Image from "next/image";

import { HomeIcon } from "@heroicons/react/solid";
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";

import { useSession, signOut } from "next-auth/react";

import SidebarLink from "./SidebarLink";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      {/* TwitterLogoImageSection */}
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <Image src="https://rb.gy/ogau5a" width={30} height={30} />
      </div>
      {/* SidebarLinks */}
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
        <SidebarLink text="Home" Icon={HomeIcon} active />
        <SidebarLink text="Explore" Icon={HashtagIcon} />
        <SidebarLink text="Notifications" Icon={BellIcon} />
        <SidebarLink text="Messages" Icon={InboxIcon} />
        <SidebarLink text="Bookmarks" Icon={BookmarkIcon} />
        <SidebarLink text="Lists" Icon={ClipboardListIcon} />
        <SidebarLink text="Profile" Icon={UserIcon} />
        <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} />
      </div>
      {/* TweetButton */}
      <button className="hidden xl:inline ml-auto bg-[#1d9bf0] text-white rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#1a8cd8]">
        Tweet
      </button>
      {/* UserDetails */}
      <div
        onClick={signOut}
        className="text-[#d9d9d9] flex items-center justify-center mt-auto hoverAnimation xl:ml-auto xl:-mr-5"
      >
        <img
          src={session.user.image}
          alt=""
          className="h-10 w-10 rounded-full xl:mr-2.5"
        />
        {/* UserName&UserId */}
        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold">{session.user.name}</h4>
          <p className="text-[#6e767d]">@{session.user.tag}</p>
        </div>
        <DotsHorizontalIcon className="h-5 hidden xl:inline ml-10" />
      </div>
    </div>
  );
}

/**
 *  Sidebar

- On screens such as phones [< small screens(640)], it is hidden.
- On small screens, we want all the icons to be aligned in the middle whereas on xl (Extra Large screens) we want to them to start from the left.
- Sidebar width on xl-screens is defined to be custom 340px out of 1500px.
- Sidebar position is defined to be fixed. This means that when we *scroll, the sidebar won’t move.* Also, the height of sidebar is defined to be 100%.

- We create another div that’ll contain the Twitter Logo Image. On smaller screens [>640px], we’ll have the logo centered and for larger screens [xl], it will have a ml-24.
- We’ll use the next Image tag and this image source will have a height and width of 30px.


- We create another div that’ll contain all the Sidebar Links.  This div will have a property of space-y-2.5. What this basically means is add a 10px spacing between every SidebarLink inside the div.
- On xl-screens, we provide a ml-24 (96px) to match with the spacing provided to the logo.
 */
