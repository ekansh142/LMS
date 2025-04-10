import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditCourseMutation, useGetCourseByIdQuery, useGetCreatorCourseQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';


const CourseTab = () => {
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: ""
    });

    const params = useParams();

    const courseId = params.courseId;

    const [editCourse, { data, isSuccess, isLoading, error }] = useEditCourseMutation();
    const { refetch } = useGetCreatorCourseQuery();

    const { data: courseByIdData, isLoading: courseByIdLoading, refetch: newRefetch } =
        useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });


    useEffect(() => {
        if (courseByIdData?.course) {
            console.log("Fetched Course Data:", courseByIdData.course); // ✅ Debugging

            setInput((prevInput) => ({
                ...prevInput, // Preserve existing values
                courseTitle: courseByIdData.course.courseTitle || input.courseTitle,
                subTitle: courseByIdData.course.subTitle || input.subTitle,
                description: courseByIdData.course.description || input.description,
                category: courseByIdData.course.category || input.category,
                courseLevel: courseByIdData.course.courseLevel || input.courseLevel,
                coursePrice: courseByIdData.course.coursePrice || input.coursePrice,
                courseThumbnail: input.courseThumbnail, // Don't override it
            }));
        }
    }, [courseByIdData]);
    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const navigate = useNavigate();

    const [publishCourse] = usePublishCourseMutation();

    const publishStatusHandler = async (action) => {
        try {
            const response = await publishCourse({ courseId, query: action });
            if (response.data) {
                newRefetch();
                refetch();
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to publish or unpublish course");
        }
    }


    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    }

    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    }

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }

    const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);

        // Append file only if it exists
        if (input.courseThumbnail) {
            formData.append("courseThumbnail", input.courseThumbnail);
        }
        await editCourse({ formData, courseId });
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || "Course updated successfully")
            navigate("/admin/course");
            refetch();
        }
        if (error) {
            toast.error(error?.data?.message || "Course update failed")
        }
    }, [isSuccess, error])

    if (courseByIdLoading) return <h1>Loading...</h1>

    const removeHandler = async () => {
        const confirm = window.confirm("Are you sure you want to remove this course? This action cannot be undone.");
        if (confirm) {
            console.log(hello)
        }
    }


    return (
        <Card>
            <CardHeader className='flex flex-row justify-between'>
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className="space-x-2">
                    <Button disabled={courseByIdData?.course.lectures.length === 0} variant="outline" onClick={() => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
                        {courseByIdData?.course.isPublished ? "Unpublished" : "Publish"}
                    </Button>
                    <Button onClick={removeHandler}>Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-4 space-y-4 mt-4'>
                    <div>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="courseTitle"
                            value={input.courseTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Full stack web developement"
                        />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subTitle"
                            value={input.subTitle}
                            onChange={changeEventHandler}
                            placeholder="Ex. Become a full stack web develop from zero to hero in 2 months"
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className='flex items-center gap-5'>
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Next JS">Next JS</SelectItem>
                                        <SelectItem value="Data Science">Data Science</SelectItem>
                                        <SelectItem value="Frontend Development">
                                            Frontend Development
                                        </SelectItem>
                                        <SelectItem value="Fullstack Development">
                                            Fullstack Development
                                        </SelectItem>
                                        <SelectItem value="MERN Stack Development">
                                            MERN Stack Development
                                        </SelectItem>
                                        <SelectItem value="Javascript">Javascript</SelectItem>
                                        <SelectItem value="Python">Python</SelectItem>
                                        <SelectItem value="Docker">Docker</SelectItem>
                                        <SelectItem value="MongoDB">MongoDB</SelectItem>
                                        <SelectItem value="HTML">HTML</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select onValueChange={selectCourseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input
                                type="number"
                                name="coursePrice"
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder="199"
                                className="w-fit"
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type="file"
                            onChange={selectThumbnail}
                            accept="image/*"
                            className="w-fit"
                        />
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail} className='w-64 my-2' alt="Course-Thumbnail" />
                            )
                        }
                    </div>
                    <div>
                        <Button variant="outline" onClick={() => navigate("/admin/course")}>Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Please Wait
                                    </>
                                ) : "Save"
                            }
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card >
    )
}

export default CourseTab
