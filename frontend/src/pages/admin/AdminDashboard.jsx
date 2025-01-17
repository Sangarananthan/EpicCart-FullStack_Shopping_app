import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Loader2, Trash2, PencilIcon, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import {
  useDeleteUserByIdMutation,
  useGetAllUSerQuery,
  useUpdateUserByIdMutation,
} from "../../redux/api/userApiSlice";

const UsersManagement = () => {
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  // Fetch all users
  const { data, refetch, isLoading, error } = useGetAllUSerQuery();

  // Update and Delete mutations
  const [updateUserById] = useUpdateUserByIdMutation();
  const [deleteUserById] = useDeleteUserByIdMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUserById({
        id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      toast.success("User updated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserById(id);
        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        {error?.data?.message || error.error}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Manage Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">User</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="w-[100px]">Role</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    {editableUserId === user._id ? (
                      <Input
                        value={editableUserName}
                        onChange={(e) => setEditableUserName(e.target.value)}
                        className="max-w-[180px]"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{user.username}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editableUserId === user._id ? (
                      <Input
                        value={editableUserEmail}
                        onChange={(e) => setEditableUserEmail(e.target.value)}
                        className="max-w-[180px]"
                        type="email"
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        user.isAdmin
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : "bg-gray-50 text-gray-600 ring-gray-500/10"
                      }`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {editableUserId === user._id ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateHandler(user._id)}
                          className="hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            toggleEdit(user._id, user.username, user.email)
                          }
                          className="hover:bg-blue-50"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      )}
                      {!user.isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => deleteHandler(user._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
