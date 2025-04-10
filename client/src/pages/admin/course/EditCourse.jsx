import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import React from 'react'
import CourseTab from './CourseTab'

const EditCourse = () => {
  return (
    <div className='flex-1 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm'>
      <div className='flex items-center justify-between mb-5'>
        <h1 className='font-bold text-xl text-zinc-800 dark:text-zinc-100'>
          Add detail information regarding course
        </h1>
        <Link to="lecture">
          <Button variant='link' className='text-blue-600 dark:text-blue-400 hover:underline'>
            Go to lectures page
          </Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  )
}

export default EditCourse
