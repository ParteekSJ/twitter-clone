import React from "react";

export default function SidebarLink({ text, Icon, active }) {
  return (
    <div
      className={`text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation ${
        active && "font-bold"
      }`}>
      <Icon className="h-7" />
      <span className="hidden xl:inline">{text}</span>
    </div>
  );
}

/**
 * Sidebar Link of >640px screens will only display the Icon and not the text. They will be centered
 * On xl screens, they have a justify-start and the span will be visible.
 */
