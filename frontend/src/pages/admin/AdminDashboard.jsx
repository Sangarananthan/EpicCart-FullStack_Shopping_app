import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  useDeleteUserByIdMutation,
  useGetAllUSerQuery,
  useUpdateUserByIdMutation,
} from "../../redux/api/userApiSlice";
import { Loader } from "lucide-react";
import Message from "../../components/Message";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AdminMenu from "../../components/AdminMenu";

const AdminDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const dispatch = useDispatch();

  // get all users
  const { data, refetch, isLoading, error } = useGetAllUSerQuery();
  useEffect(() => {
    refetch();
  }, [refetch]);

  //update user by id
  const [updateUserById] = useUpdateUserByIdMutation();
  const updateHandler = async (id) => {
    try {
      await updateUserById({
        id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  //delete user by id
  const [deleteUserById] = useDeleteUserByIdMutation();
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUserById(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mx-auto px-4 py-8 mt-[3rem] md:px-[2rem]">
      <AdminMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Main Content */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="p-6 md:ml-0">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6"
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Manage Users
            </h1>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) =>
                              setEditableUserName(e.target.value)
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-indigo-100 font-medium">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="ml-4 font-medium text-gray-900">
                              {user.username}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editableUserId === user._id ? (
                          <input
                            type="text"
                            value={editableUserEmail}
                            onChange={(e) =>
                              setEditableUserEmail(e.target.value)
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <div className="flex items-center">
                            <span className="ml-4 font-medium text-gray-900">
                              {user.email}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isAdmin
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          {editableUserId === user._id ? (
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg"
                            >
                              <FaCheck />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                            >
                              <FaEdit className="ml-[1rem]" />
                            </button>
                          )}
                          {!user.isAdmin && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteHandler(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash size={18} />
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
