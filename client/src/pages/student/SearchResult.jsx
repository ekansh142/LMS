import { Badge } from '@/components/ui/badge'
import React from 'react'
import { Link } from 'react-router-dom'

const SearchResult = ({ course }) => {
    return (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-zinc-200 dark:border-zinc-700">
            <Link
                to={`/course-detail/${course._id}`}
                className="flex flex-col md:flex-row gap-4 w-full"
            >
                <img
                    src={course.courseThumbnail}
                    alt="course-thumbnail"
                    className="h-40 w-full md:w-56 object-cover rounded-xl"
                />
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{course.courseTitle}</h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{course.subTitle}</p>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        Instructor: <span className="font-semibold text-orange-500">{course.creator?.name}</span>
                    </p>
                    <Badge className="w-fit mt-1">{course.courseLevel}</Badge>
                </div>
            </Link>
            <div className="w-full md:w-auto text-left md:text-right">
                <p className="text-lg font-bold text-zinc-800 dark:text-white">₹{course.coursePrice}</p>
            </div>
        </div>
    );
    
}

export default SearchResult
