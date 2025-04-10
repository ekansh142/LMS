import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    useCreateLectureMutation,
    useGetLectureQuery
} from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
    const navigate = useNavigate();
    const [lectureTitle, setLectureTitle] = useState("");
    const params = useParams();
    const courseId = params.courseId;

    const [createLecture, { data, isSuccess, isLoading, error }] = useCreateLectureMutation();
    const {
        data: lectureData,
        isLoading: lectureLoading,
        isError: lectureError,
        refetch
    } = useGetLectureQuery(courseId);

    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Lecture created successfully");
            refetch();
            setLectureTitle("");
        }
        if (error) {
            toast.error(error?.data?.message || "Failed to create lecture");
        }
    }, [isSuccess, error]);

    return (
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm min-h-screen">
            <div className="mb-6">
                <h1 className="font-bold text-xl text-zinc-900 dark:text-white">
                    Let’s add lectures to your course
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Give your lecture a title and start building out your course content one step at a time.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <Label className="text-zinc-800 dark:text-zinc-200">Title</Label>
                    <Input
                        type="text"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="Your lecture name"
                        className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>
                        Back to course
                    </Button>
                    <Button disabled={isLoading} onClick={createLectureHandler}>
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please Wait
                                </>
                            ) : "Create Lecture"
                        }
                    </Button>
                </div>

                <div className="mt-10 space-y-4">
                    {
                        lectureLoading ? (
                            <p className="text-muted-foreground">Loading lectures...</p>
                        ) : lectureError ? (
                            <p className="text-red-500">Failed to load lectures.</p>
                        ) : lectureData.lectures.length === 0 ? (
                            <p className="text-muted-foreground">No lectures available.</p>
                        ) : (
                            lectureData.lectures.map((lecture, index) => (
                                <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateLecture
