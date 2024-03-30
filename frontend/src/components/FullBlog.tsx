import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { Appbar } from "./Appbar";
import { Avatar } from "./Avatar";
import { useLike } from "../hooks";

type Blog = {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
  };
};

type LikedBy = [userId: number, blogId: number];

type FullBlog = Blog & { likedBy: LikedBy };

export const FullBlog = ({ blog, like }: { blog: FullBlog; like: boolean }) => {
  const { currLike, currLen, handleLike } = useLike(like, blog.likedBy.length, blog.id);
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-12">
          <div className="col-span-8">
            <div className="text-5xl font-extrabold">{blog.title}</div>
            <div className="text-slate-500 pt-2">
              Published date will come here
            </div>
            <div className="flex gap-2 text-2xl">
              <button
                className="my-auto"
                onClick={() => {
                  handleLike();
                }}
              >
                {currLike ? (
                  <GoHeartFill className=" text-red-500" />
                ) : (
                  <GoHeart />
                )}
              </button>
              {currLen}
            </div>
            <div className="pt-4">{blog.content}</div>
          </div>
          <div className="col-span-4">
            <div className="text-slate-600 text-lg">Author</div>
            <div className="flex w-full">
              <div className="pr-4 flex flex-col justify-center">
                <Avatar size="big" name={blog.author.name || "Anonymous"} />
              </div>
              <div>
                <div className="text-xl font-bold">
                  {blog.author.name || "Anonymous"}
                </div>
                <div className="pt-2 text-slate-500">
                  Random catch phrase about the author's ability to grab the
                  user's attention
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
