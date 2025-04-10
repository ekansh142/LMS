import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Course from './Course';
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';

const Profile = () => {
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null); // Ensure profilePhoto is initialized correctly

    // Fetch user data
    const { data, isLoading: userLoading, refetch } = useLoadUserQuery();
    const { user } = data || {}; // Avoid errors when `data` is undefined

    // Mutation for updating user
    const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess }] = useUpdateUserMutation();

    // Effect to update local state when user data loads
    useEffect(() => {
        if (user) {
            setName(user.name || ""); // Ensure a default value
        }
    }, [user]);

    // Effect to show success/error messages
    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(updateUserData?.message || "Profile updated successfully");
        } else if (isError) {
            toast.error(error?.data?.message || "Profile update failed");
        }
    }, [isSuccess, isError]); // Removed `data` & `error` from dependencies to prevent unnecessary re-renders

    useEffect(() => {
        refetch();
    }, [])

    const onChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePhoto(file);
        }
    }

    const updateUserHandler = async () => {
        const formData = new FormData();
        formData.append("name", name);
        if (profilePhoto) {
            formData.append("profilePhoto", profilePhoto);
        }
        await updateUser(formData);
    };

    if (userLoading) {
        return <h1>Profile loading...</h1>
    }

    return (
        <div className="max-w-4xl mx-auto px-4 my-8">
            <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
                    <AvatarImage src={user?.photoUrl || "https://github.com/shadcn.png"} className="rounded-full" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='mt-7'>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Name:
                            <span className='font-normal text-gray-700 dark:text-gray-300'> {user?.name}</span>
                        </h1>
                    </div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Email:
                            <span className='font-normal text-gray-700 dark:text-gray-300'> {user?.email}</span>
                        </h1>
                    </div>
                    <div className='mb-2'>
                        <h1 className='font-semibold text-gray-900 dark:text-gray-100'>
                            Role:
                            <span className='font-normal text-gray-700 dark:text-gray-300'> {user?.role?.toUpperCase()}</span>
                        </h1>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm" className='mt-2'>Edit Profile</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you're
                                    done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className='grid gap-4 py-4'>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label>Name</Label>
                                    <Input
                                        type="text"
                                        value={name}
                                        placeholder="Name"
                                        className="col-span-3"
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label>Profile Photo</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="col-span-3"
                                        onChange={onChangeHandler}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                                    {updateUserIsLoading ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please Wait
                                        </>
                                    ) : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div>
                <h1 className='font-medium text-lg'>Courses you are enrolled in</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
                    {
                        user?.enrolledCourses?.length === 0 ? (
                            <h1>You haven't enrolled yet</h1>
                        ) : (
                            user?.enrolledCourses?.map((course) => <Course course={course} key={course._id} />)
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;
