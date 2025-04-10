import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { getCourseProgress, markAsCompleted, markAsIncompleted, updateCourseProgress } from '../controllers/courseProgress.controller.js';

const router = express.Router();

router.get('/:courseId', isAuthenticated, getCourseProgress);
router.post('/:courseId/lecture/:lectureId/view', isAuthenticated, updateCourseProgress);
router.post('/:courseId/complete', isAuthenticated, markAsCompleted);
router.post('/:courseId/incomplete', isAuthenticated, markAsIncompleted);

export default router;