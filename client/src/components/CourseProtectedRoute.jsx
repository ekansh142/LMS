import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseCourseApi";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

const CourseProtectedRoute = ({ children }) => {
    const { courseId } = useParams();
    const { data, isLoading } = useGetCourseDetailWithStatusQuery(courseId);

    if (isLoading) {
        return <p>Loading...</p>
    }
    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`} />
}

export default CourseProtectedRoute;