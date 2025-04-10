import { Button } from '@/components/ui/button'
import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { useGetCreatorCourseQuery } from '@/features/api/courseApi.js';
import { Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CourseTable = () => {
    const { data, isLoading } = useGetCreatorCourseQuery();
    const navigate = useNavigate();

    if (isLoading) return <h1 className="text-lg text-center text-muted-foreground">Loading...</h1>;

    return (
        <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
            <div className="mb-4 flex justify-start">
                <Button onClick={() => navigate(`create`)}>
                    Create a new course
                </Button>
            </div>
            <Table>
                <TableCaption className="text-muted-foreground">A list of your recent courses.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-zinc-700 dark:text-zinc-300">Price</TableHead>
                        <TableHead className="text-zinc-700 dark:text-zinc-300">Status</TableHead>
                        <TableHead className="text-zinc-700 dark:text-zinc-300">Title</TableHead>
                        <TableHead className="text-right text-zinc-700 dark:text-zinc-300">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.courses.map((course) => (
                        <TableRow key={course._id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <TableCell className="font-medium text-zinc-800 dark:text-zinc-200">
                                {course?.coursePrice || "NA"}
                            </TableCell>
                            <TableCell>
                                <Badge variant={course.isPublished ? "default" : "secondary"}>
                                    {course.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-zinc-800 dark:text-zinc-200">{course.courseTitle}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    size='sm'
                                    variant='ghost'
                                    onClick={() => navigate(`${course._id}`)}
                                >
                                    <Edit className="text-zinc-600 dark:text-zinc-300" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CourseTable;
