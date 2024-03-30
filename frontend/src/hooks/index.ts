import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

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

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<FullBlog>();
  const [like, setLike] = useState(false);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlog(response.data.blog);
        setLike(response.data.like);
        setLoading(false);
      });
  }, [id]);

  return { loading, blog, like };
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlogs(response.data.blogs);
        setLoading(false);
      });
  }, []);

  return {
    blogs,
    loading,
  };
};

export const useLike = (
  initialLike: boolean,
  initialLen: number,
  blogId: number
) => {
  const [currLike, setCurrLike] = useState<boolean>(initialLike);
  const [currLen, setCurrLen] = useState<number>(initialLen);

  const handleLike = () => {
    if (currLike) {
      axios
        .delete(`${BACKEND_URL}/api/v1/blog/unlike/${blogId}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then(() => {
          setCurrLen(currLen - 1);
          setCurrLike(!currLike);
        });
    } else {
      axios
        .post(
          `${BACKEND_URL}/api/v1/blog/like/${blogId}`,
          {},
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(() => {
          setCurrLen(currLen + 1);
          setCurrLike(!currLike);
        });
    }
  };

  return { currLike, currLen, handleLike };
};
