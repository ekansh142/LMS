import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "https://lms-hhw0.onrender.com/api/v1/course/"

export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: "Refetch_Creator_Course",
    baseQuery: fetchBaseQuery({
        baseUrl: COURSE_API,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "",
                method: "POST",
                body: { courseTitle, category }
            }),
            invalidatesTags: ["Refetch_Creator_Course"]
        }),
        getSearchCourse: builder.query({
            query: ({ searchQuery, categories, sortByPrice }) => {
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}`
                if (categories && categories.length > 0) {
                    const categoriesString = categories.map(encodeURIComponent).join(",")
                    queryString += `&categories=${categoriesString}`
                }
                if (sortByPrice) {
                    queryString += `&sortByPrice=${sortByPrice}`
                }

                return {
                    url: queryString,
                    method: "GET"
                }
            }
        }),
        getPublishedCourse: builder.query({
            query: () => ({
                url: "published-courses",
                method: "GET"
            })
        }),
        getCreatorCourse: builder.query({
            query: () => ({
                url: "",
                method: "GET"
            }),
            providesTags: ["Refetch_Creator_Course"]
        }),
        editCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
                url: `/${courseId}`,
                method: "PUT",
                body: formData
            })
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "GET"
            })
        }),
        createLecture: builder.mutation({
            query: ({ lectureTitle, courseId }) => ({
                url: `/${courseId}/lecture`,
                method: "POST",
                body: { lectureTitle }
            })
        }),
        getLecture: builder.query({
            query: (courseId) => ({
                url: `/${courseId}/lecture`,
                method: "GET"
            })
        }),
        editLecture: builder.mutation({
            query: ({ lectureTitle, videoInfo, isPreviewFree, courseId, lectureId }) => ({
                url: `/${courseId}/lecture/${lectureId}`,
                method: "POST",
                body: { lectureTitle, videoInfo, isPreviewFree }
            })
        }),
        removeLecture: builder.mutation({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "DELETE"
            })
        }),
        getLectureById: builder.query({
            query: (lectureId) => ({
                url: `/lecture/${lectureId}`,
                method: "GET"
            })
        }),
        publishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
                url: `/${courseId}?publish=${query}`,
                method: "PATCH",
            }),
        })
    })
})

export const {
    useCreateCourseMutation,
    useGetSearchCourseQuery,
    useGetPublishedCourseQuery,
    useGetCreatorCourseQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetLectureQuery,
    useEditLectureMutation,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation
} = courseApi