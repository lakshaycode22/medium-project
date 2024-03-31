import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

interface props {
  blogId: Number;
}

export const DeleteBlog = ({ blogId }: props) => {
  const navigate = useNavigate();
  const handleDelete = () => {
    const confirmBox = window.confirm(
      "Do you really want to delete this Blog?"
    );
    if (confirmBox === true) {
      axios
        .delete(`${BACKEND_URL}/api/v1/blog/delete/${blogId}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then(() => {
          navigate("/blogs");
        })
        .catch(() =>
          window.alert("You can not delete this blog as you are not the author")
        );
    }
  };
  return (
    <button
      onClick={handleDelete}
      className="mt-4 p-2 bg-red-600 text-white rounded-md"
    >
      Delete Blog
    </button>
  );
};
