import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useCompleteCourseMutation, useGetCourseProgressQuery, useIncompleteCourseMutation, useUpdateCourseProgressMutation } from '@/features/api/courseProgressApi';
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseProgress = () => {
    const params = useParams();
    const courseId = params.courseId;
    const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

    const [currentLecture, setCurrentLecture] = useState(null);

    const [updateCourseProgress] = useUpdateCourseProgressMutation();

    let [completeCourse, { data: completeData, isSuccess: completeIsSuccess }] = useCompleteCourseMutation();
    let [incompleteCourse, { data: incompleteData, isSuccess: incompleteIsSuccess }] = useIncompleteCourseMutation();

    useEffect(() => {
        if (completeIsSuccess) {
            refetch();
            completeIsSuccess = false;
            toast.success(completeData.message);
        }
        if (incompleteIsSuccess) {
            refetch();
            incompleteIsSuccess = false;
            toast.success(incompleteData.message);
        }
    }, [completeIsSuccess, incompleteIsSuccess])

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Failed to load course details</p>;

    console.log(data);

    const { courseDetails, progress, completed } = data.data;
    const { courseTitle } = courseDetails;




    const handleLectureProgress = async (lectureId) => {
        await updateCourseProgress({ courseId, lectureId });
        refetch();
    }


    console.log(data);

    const isLectureCompleted = (lectureId) => {
        return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
    }

    const handleSelectLecture = (lecture) => {
        setCurrentLecture(lecture);
    }

    const handleCompleteCourse = async () => {
        await completeCourse(courseId);
        refetch();
    }

    const handleIncompleteCourse = async () => {
        await incompleteCourse(courseId);
        refetch();
    }
    const initialLecture = currentLecture || courseDetails.lectures && courseDetails.lectures[0];



    return (
        <div className='max-w-7xl mx-auto p-4 mt-7'>
            <div className='flex justify-between mb-4'>
                <h1 className='text-2xl font-bold'>{courseTitle}</h1>
                <Button onClick={completed ? handleIncompleteCourse : handleCompleteCourse}
                    variant={completed ? 'outline' : 'default'}
                >
                    {
                        completed ? <div className='flex items-center'><CheckCircle className='h-4 w-4 mr-2' /><span>Mark all as incomplete</span></div> :
                            <div className='flex items-center'><CheckCircle2 className='h-4 w-4 mr-2' /><span>Mark all as complete</span></div>
                    }
                </Button>
            </div>

            <div className='flex flex-col md:flex-row gap-6'>
                {/* Video Section */}
                <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
                    <div>
                        <video
                            src={currentLecture?.videoUrl || initialLecture?.videoUrl}
                            controls
                            className='w-full h-auto md:rounded-lg'
                            onEnded={() => handleLectureProgress(currentLecture?._id || initialLecture?._id)}
                        />
                    </div>
                    {/* Display current watching lecture title */}
                    <div className='mt-2'>
                        <h3 className='font-medium text-lg'>
                            {
                                `Lecture ${courseDetails.lectures.findIndex((lec) => lec._id === (currentLecture?._id || initialLecture?._id)) + 1} : ${currentLecture?.lectureTitle || initialLecture?.lectureTitle} `
                            }
                        </h3>
                    </div>
                </div>
                {/* Lecture Sidebar */}
                <div className="flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
                    <h2 className='font-semibold text-xl mb-4'>Course Lectures</h2>
                    <div className="flex-1 overflow-y-auto">
                        {
                            courseDetails?.lectures.map((lecture) => (
                                <Card
                                    key={lecture._id}
                                    className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-900'} `}
                                    onClick={() => handleSelectLecture(lecture)}
                                >
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className='flex items-center'>
                                            {
                                                isLectureCompleted(lecture._id) ? (<CheckCircle2 size={24} className='text-green-500 mr-2' />) : (<CirclePlay size={24} className='text-gray-500 mr-2' />)
                                            }
                                            <div>
                                                <CardTitle className='text-lg font-medium'>{lecture.lectureTitle}</CardTitle>
                                            </div>
                                        </div>
                                        {
                                            isLectureCompleted(lecture._id) && (
                                                <Badge variant={'outline'} className='bg-green-200 text-green-600'>Completed</Badge>
                                            )
                                        }
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseProgress
