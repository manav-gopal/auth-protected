"use client";

import React, { useState, useEffect } from "react";
// import { getCategories } from "@/utils/get-user-categories";
import { getCategories } from "@/utils/get-user-categories";
import { updateUserInterests } from "@/utils/update-user-interests";

type Category = {
  id: string;
  name: string;
  interested: boolean;
};

const Categories: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchcategories = async (page: number) => {
    const offset = (page - 1) * limit;
    const result = await getCategories(limit, offset);

    if (result) {
      setCategories(result.categories);
      setTotalCount(result.totalCount);
    }
  };

  useEffect(() => {
    fetchcategories(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / limit);

  const handleInterestToggle = async (id: string, interested: boolean) => {
    setCategories((categories) => {
      return categories.map((category) => ({
        ...category,
        interested: category.id === id ? interested : category.interested,
      }));
    });
    await updateUserInterests({ categoryId: id, interested: interested });
  };

  const pageButton = (pageNum: number) => (
    <button
      onClick={() => setCurrentPage(pageNum)}
      className="px-2 text-gray-400 hover:scale-125"
    >
      {pageNum}
    </button>
  );
  const renderPageNumbers = () => (
    <>
      {currentPage > 1 && pageButton(currentPage - 1)}
      <label className="px-2 text-lg font-bold">{currentPage}</label>
      {currentPage < totalPages && pageButton(currentPage + 1)}
      <label className="px-2 text-lg">{"...."}</label>
      {pageButton(totalPages)}
    </>
  );

  return (
    <div className="mx-auto w-full max-w-xl rounded-[20px] border-[1px] border-[#C1C1C1] p-12 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold">
        Please mark your categories!
      </h2>
      <p className="mb-8 text-center text-sm font-normal text-black">
        We will keep you notified.
      </p>

      <h3 className="mb-8 text-xl font-medium">My saved categories!</h3>
      <ul className="mb-4">
        {categories.map((category) => (
          <li key={category.id} className="my-4 flex items-center">
            <div className="relative mr-2 inline-block h-5 w-5">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                checked={category.interested}
                onChange={() =>
                  handleInterestToggle(category.id, !category.interested)
                }
                className="absolute h-0 w-0 opacity-0"
              />
              <label
                htmlFor={`category-${category.id}`}
                className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border ${category.interested ? "bg-black" : "bg-gray-300"}`}
              >
                {category.interested && (
                  <svg
                    className="h-[10px] w-[14px] fill-current text-white"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </label>
            </div>
            <label
              htmlFor={`category-${category.id}`}
              className="px-2 font-normal"
            >
              {category.name}
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-16 flex items-center justify-center text-sm">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="mx-2 hover:scale-125"
        >
          &lt;&lt;
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mx-2 hover:scale-125"
        >
          &lt;
        </button>
        {renderPageNumbers()}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="mx-2 hover:scale-125"
        >
          &gt;
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="mx-2 hover:scale-125"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default Categories;
