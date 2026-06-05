import { computed, ref } from 'vue'
import { useCourseCatalog } from '@/composables/useCourseCatalog'
import { useNotifications } from '@/composables/useNotifications'
import {
  getActiveUserId,
  getStoredSession,
  readScopedStorage,
  subscribeToUserStorage,
  writeScopedStorage,
} from '@/utils/userStorage'

const STORAGE_KEYS = {
  enrolled: 'smartlearn_enrolled_courses',
  favorites: 'smartlearn_favorite_courses',
  completed: 'smartlearn_completed_lessons',
}

const defaultEnrolledIds = [
  'html-css-foundation',
  'javascript-beginner',
  'vue-foundation-to-practice',
  'php-mysql-foundation',
  'laravel-framework',
]

function initialEnrolledIds() {
  return getStoredSession()?.email === 'alex@example.com' ? defaultEnrolledIds : []
}

function readStorage(key, fallback) {
  const migrateLegacy = getStoredSession()?.email === 'alex@example.com'
  return readScopedStorage(key, fallback, { migrateLegacy })
}

function writeStorage(key, value) {
  writeScopedStorage(key, value)
}

const enrolledIds = ref(readStorage(STORAGE_KEYS.enrolled, initialEnrolledIds()))
const favoriteIds = ref(readStorage(STORAGE_KEYS.favorites, []))
const completedLessons = ref(readStorage(STORAGE_KEYS.completed, {}))
let storageOwner = getActiveUserId()

subscribeToUserStorage(() => {
  const nextOwner = getActiveUserId()
  if (nextOwner === storageOwner) return

  storageOwner = nextOwner
  enrolledIds.value = readStorage(STORAGE_KEYS.enrolled, initialEnrolledIds())
  favoriteIds.value = readStorage(STORAGE_KEYS.favorites, [])
  completedLessons.value = readStorage(STORAGE_KEYS.completed, {})
})

function isEnrolled(courseId) {
  return enrolledIds.value.includes(courseId)
}

function enrollCourse(courseId) {
  if (isEnrolled(courseId)) return
  enrolledIds.value = [...enrolledIds.value, courseId]
  writeStorage(STORAGE_KEYS.enrolled, enrolledIds.value)

  const course = useCourseCatalog().getCourseById(courseId)
  useNotifications().addNotification({
    title: 'បានចុះឈ្មោះវគ្គសិក្សា',
    message: course ? `អ្នកបានចូលរៀន ${course.title}។` : 'វគ្គថ្មីត្រូវបានបន្ថែមទៅវគ្គរបស់ខ្ញុំ។',
    type: 'success',
    to: '/my-courses',
  })
}

function unenrollCourse(courseId) {
  enrolledIds.value = enrolledIds.value.filter((id) => id !== courseId)
  writeStorage(STORAGE_KEYS.enrolled, enrolledIds.value)

  useNotifications().addNotification({
    title: 'បានដកវគ្គចេញ',
    message: 'វគ្គនេះត្រូវបានដកចេញពីបញ្ជីរបស់អ្នក។',
    type: 'warning',
    to: '/my-courses',
  })
}

function isFavorite(courseId) {
  return favoriteIds.value.includes(courseId)
}

function toggleFavorite(courseId) {
  const nextFavorite = !isFavorite(courseId)

  favoriteIds.value = !nextFavorite
    ? favoriteIds.value.filter((id) => id !== courseId)
    : [...favoriteIds.value, courseId]

  writeStorage(STORAGE_KEYS.favorites, favoriteIds.value)

  if (nextFavorite) {
    useNotifications().addNotification({
      title: 'បានរក្សាទុកវគ្គ',
      message: 'វគ្គនេះត្រូវបានបន្ថែមទៅ Saved courses។',
      type: 'info',
      to: '/my-courses',
    })
  }
}

function isLessonComplete(courseId, lessonIndex) {
  return completedLessons.value[courseId]?.includes(lessonIndex) ?? false
}

function markLessonComplete(courseId, lessonIndex) {
  const course = useCourseCatalog().getCourseById(courseId)
  const normalizedLessonIndex = Number(lessonIndex)
  if (
    !course ||
    !Number.isInteger(normalizedLessonIndex) ||
    normalizedLessonIndex < 0 ||
    normalizedLessonIndex >= course.lessons.length
  ) {
    return false
  }

  enrollCourse(courseId)

  const currentLessons = completedLessons.value[courseId] ?? []
  if (currentLessons.includes(normalizedLessonIndex)) return false

  completedLessons.value = {
    ...completedLessons.value,
    [courseId]: [...currentLessons, normalizedLessonIndex],
  }

  writeStorage(STORAGE_KEYS.completed, completedLessons.value)

  const completedCount = completedLessons.value[courseId]?.length ?? 0

  useNotifications().addNotification({
    title: 'បានបញ្ចប់មេរៀន',
    message: course ? `អ្នកបានបញ្ចប់មេរៀនក្នុង ${course.title}។` : 'មេរៀនត្រូវបានកត់ត្រា។',
    type: 'success',
    to: `/courses/${courseId}/lessons/${normalizedLessonIndex}`,
  })

  if (course && completedCount >= course.lessons.length) {
    useNotifications().addNotification({
      title: 'វគ្គនេះរួចរាល់សម្រាប់ Quiz',
      message: 'អ្នកបានបញ្ចប់មេរៀនសំខាន់ៗទាំងអស់។ សូមធ្វើ Quiz ដើម្បីទទួល Certificate។',
      type: 'success',
      to: `/courses/${courseId}/quiz`,
    })
  }

  return true
}

function getCourseProgress(course) {
  const completed = completedLessons.value[course.id]

  if (completed?.length && course.lessons.length) {
    const validCompletedCount = completed.filter(
      (lessonIndex) => Number.isInteger(lessonIndex) && lessonIndex >= 0 && lessonIndex < course.lessons.length,
    ).length
    const lessonProgress = Math.round((validCompletedCount / course.lessons.length) * 100)
    return Math.max(lessonProgress, isEnrolled(course.id) ? course.progress || 0 : 0)
  }

  return isEnrolled(course.id) ? course.progress || 0 : 0
}

function getCompletedLessonCount(course) {
  const completed = completedLessons.value[course.id]

  if (completed?.length) {
    return completed.filter(
      (lessonIndex) => Number.isInteger(lessonIndex) && lessonIndex >= 0 && lessonIndex < course.lessons.length,
    ).length
  }
  if (!isEnrolled(course.id)) return 0

  return Math.round((getCourseProgress(course) / 100) * course.lessonsCount)
}

function isCourseComplete(course) {
  const completed = completedLessons.value[course.id] ?? []
  const validLessons = new Set(
    completed.filter(
      (lessonIndex) => Number.isInteger(lessonIndex) && lessonIndex >= 0 && lessonIndex < course.lessons.length,
    ),
  )
  return course.lessons.length > 0 && validLessons.size === course.lessons.length
}

export function useLearning() {
  const { allCourses } = useCourseCatalog()
  const enrolledCourses = computed(() => allCourses.value.filter((course) => isEnrolled(course.id)))
  const favoriteCourses = computed(() => allCourses.value.filter((course) => isFavorite(course.id)))

  return {
    enrolledIds,
    favoriteIds,
    completedLessons,
    enrolledCourses,
    favoriteCourses,
    enrollCourse,
    unenrollCourse,
    getCompletedLessonCount,
    getCourseProgress,
    isEnrolled,
    isCourseComplete,
    isFavorite,
    isLessonComplete,
    markLessonComplete,
    toggleFavorite,
  }
}
