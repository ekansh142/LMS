import { response } from "express";
import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";

export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        let courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");

        const courseDetails = await Course.findById(courseId).populate("lectures");

        if (!courseDetails) {
            return res.status(404).json({
                message: "Course not found"
            })
        }

        if (!courseProgress) {
            return res.status(200).json({
                data: {
                    courseDetails,
                    progress: [],
                    completed: false
                }
            })
        }

        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed).length;

        const course = await Course.findById(courseId).populate("lectures");

        console.log(course.lectures.length, lectureProgressLength);

        if (course.lectures.length === lectureProgressLength) courseProgress.completed = true;
        await courseProgress.save();

        //return the user course progress along with course details
        return res.status(200).json({
            data: {
                courseDetails,
                course,
                progress: courseProgress.lectureProgress,
                completed: courseProgress.completed,
                courseProgress
            }
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateCourseProgress = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const userId = req.id;

        let courseProgress = await CourseProgress.findOne({ courseId, userId });

        if (!courseProgress) {
            courseProgress = new CourseProgress({
                userId,
                courseId,
                completed: false,
                lectureProgress: []
            })
        }

        const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId)

        if (lectureIndex !== -1) {
            courseProgress.lectureProgress[lectureIndex].viewed = true;
        } else {
            courseProgress.lectureProgress.push({
                lectureId,
                viewed: true
            })
        }

        const lectureProgressLength = courseProgress.lectureProgress.filter((lectureProg) => lectureProg.viewed).length;

        const course = await Course.findById(courseId);

        if (course.lectures.length === lectureProgressLength) courseProgress.completed = true;

        await courseProgress.save();

        return res.status(200).json({
            message: "Lecture progress updated successfully"
        })
    } catch (error) {
        console.log(error);
    }
}

export const markAsCompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({ courseId, userId });

        if (!courseProgress) {
            return res.status(404).json({
                message: "Course Progress not found"
            })
        }

        courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = true);
        courseProgress.completed = true;
        await courseProgress.save();
        return res.status(200).json({
            message: "Course marked as completed"
        })
    } catch (error) {
        console.log(error)
    }
}

export const markAsIncompleted = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;

        const courseProgress = await CourseProgress.findOne({ courseId, userId });

        if (!courseProgress) {
            return res.status(404).json({
                message: "Course Progress not found"
            })
        }

        courseProgress.lectureProgress.map((lectureProgress) => lectureProgress.viewed = false);
        courseProgress.completed = false;
        await courseProgress.save();
        return res.status(200).json({
            message: "Course marked as incompleted"
        })
    } catch (error) {
        console.log(error)
    }
}