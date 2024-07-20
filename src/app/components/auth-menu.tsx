"use client";

import React, { useState, useRef, useEffect } from "react";
import queryClient from "@/utils/query-client";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type AuthMenuProps = {
  userName: string | null;
};

const AuthMenu: React.FC<AuthMenuProps> = ({ userName }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { mutate: logoutFn } = trpc.logoutUser.useMutation({
    onError(error) {
      toast.error(error.message);
      console.log("Error message:", error.message);
    },
    onSuccess() {
      queryClient.clear();
      toast.success("Logout successful");
      router.replace("/login");
    },
  });

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div
        className="text-ct-dark-600 cursor-pointer text-sm"
        onClick={handleToggleDropdown}
      >
        {typeof userName === "string" ? `Hi, ${userName}` : "User"}
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded border bg-white shadow-lg">
          <button
            className="text-ct-dark-600 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            onClick={() => logoutFn()}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthMenu;
