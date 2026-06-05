import { courses, getCourseById } from '@/data/courses'

const STORAGE_KEY = 'smartlearn_admin_courses'

function wait(data) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(structuredClone(data)), 250)
  })
}

function readAdminCourses() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function writeAdminCourses(value) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export async function fetchCourses() {
  return wait([...courses, ...readAdminCourses()])
}

export async function fetchCourseById(id) {
  const publishedAdminCourse = readAdminCourses().find(
    (course) => course.id === id && course.status !== 'Draft',
  )
  return wait(getCourseById(id) ?? publishedAdminCourse ?? null)
}

export async function fetchAdminSummary() {
  const adminCourses = readAdminCourses()

  return wait({
    publishedCourses: courses.length,
    draftCourses: adminCourses.length,
    totalStudents: courses.reduce((total, course) => total + course.students, 0),
    averageRating: (
      courses.reduce((total, course) => total + course.rating, 0) / courses.length
    ).toFixed(1),
  })
}

export async function createAdminCourse(course) {
  const adminCourses = readAdminCourses()
  const nextCourse = {
    id: `admin-${Date.now()}`,
    lessons: ['Intro', 'Practice', 'Project'],
    rating: 0,
    students: 0,
    progress: 0,
    ...course,
  }

  writeAdminCourses([nextCourse, ...adminCourses])
  return wait(nextCourse)
}

export async function fetchAdminCourses() {
  return wait(readAdminCourses())
}
