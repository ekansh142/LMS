import { Menu, School } from "lucide-react";
import React, { useEffect } from 'react'
import { GraduationCap } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import DarkMode from '../DarkMode';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { Separator } from "./ui/separator";

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        await logoutUser();
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "User logged out")
            navigate("/login");
        }
    }, [isSuccess])

    return (
        <header className="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-transparent border-b border-zinc-200 dark:border-transparent shadow-sm">


            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

                {/* Logo + Title */}
                <div className="flex items-center gap-3">
                    <GraduationCap className="text-orange-500 dark:text-orange-400" size={26} />
                    <Link to="/" className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                        SkillSphere
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer">
                                    <AvatarImage
                                        src={user.photoUrl || "https://github.com/shadcn.png"}
                                        alt="User avatar"
                                    />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Link to="/my-learning" className="w-full">My Learning</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="/profile" className="w-full">Edit Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logoutHandler}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                {user.role === "instructor" && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Link to="/admin/dashboard" className="w-full">Dashboard</Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => navigate("/login")}>
                                Signup
                            </Button>
                        </div>
                    )}
                    <DarkMode />
                </div>

                {/* Mobile Nav */}
                <div className="flex md:hidden items-center gap-3">
                    <DarkMode />
                    <MobileNavbar />
                </div>
            </div>
        </header>
    );
};


export default Navbar

const MobileNavbar = () => {
    const navigate = useNavigate();
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
    const { user } = useSelector(store => store.auth);

    const logoutHandler = async () => {
        await logoutUser();
    }
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    className="rounded-full hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle> <Link to="/">E-Learning</Link></SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <Separator className="mr-2" />
                <nav className="flex flex-col space-y-4">
                    <Link to="/my-learning">My Learning</Link>
                    <Link to="/profile">Edit Profile</Link>
                    <Link onClick={logoutHandler}><p>Log out</p></Link>
                </nav>
                {user?.role === "instructor" && (
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={() => navigate("/admin/dashboard")}>Dashboard</Button>
                        </SheetClose>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};