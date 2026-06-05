import { computed, ref } from 'vue'
import { courses as seedCourses } from '@/data/courses'
import { normalizeLesson } from '@/utils/lessonContent'

const STORAGE_KEY = 'smartlearn_admin_courses'

const fallbackQuiz = [
  {
    question: 'តើគោលដៅសំខាន់នៃវគ្គនេះគឺអ្វី?',
    options: ['មើលមេរៀនតែប៉ុណ្ណោះ', 'អនុវត្តជំនាញតាម project', 'ចាំពាក្យបច្ចេកទេស', 'រំលងលំហាត់'],
    answer: 1,
  },
  {
    question: 'បន្ទាប់ពីមេរៀននីមួយៗ អ្នកគួរធ្វើអ្វី?',
    options: ['បិទ browser', 'Mark complete និងអនុវត្ត', 'រំលងទៅវគ្គថ្មី', 'លុប progress'],
    answer: 1,
  },
  {
    question: 'តើត្រូវការពិន្ទុប៉ុន្មានដើម្បីជាប់ Quiz?',
    options: ['50%', '60%', '70%', '100%'],
    answer: 2,
  },
]

function readCustomCourses() {
  if (typeof window === 'undefined') return []

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

function writeCustomCourses(courses) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function fallbackImage(category) {
  return seedCourses.find((course) => course.category === category)?.image ?? seedCourses[0]?.image ?? ''
}

function normalizeLessons(value) {
  if (Array.isArray(value)) {
    return value
      .map((lesson) => (typeof lesson === 'string' ? lesson.trim() : lesson))
      .filter((lesson) => (typeof lesson === 'string' ? lesson : lesson?.title))
  }

  return String(value ?? '')
    .split('\n')
    .map((lesson) => lesson.trim())
    .filter(Boolean)
}

function makeId(title) {
  const slug = String(title ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `admin-${slug || 'course'}-${Date.now()}`
}

function hydrateCourse(course) {
  const normalizedLessons = normalizeLessons(course.lessons)
  const rawLessons = normalizedLessons.length
    ? normalizedLessons
    : ['Course overview', 'Guided practice', 'Final project']
  const category = course.category || 'Frontend'
  const lessons = rawLessons.map((lesson) => normalizeLesson(lesson, { ...course, category }))

  return {
    id: course.id || makeId(course.title),
    title: course.title || 'Untitled course',
    category,
    level: course.level || 'មូលដ្ឋាន',
    duration: course.duration || '៤ សប្តាហ៍',
    lessonsCount: Number(course.lessonsCount || lessons.length),
    rating: Number(course.rating ?? 0),
    students: Number(course.students ?? 0),
    instructor: course.instructor || 'គ្រូ SmartLearn',
    progress: Number(course.progress ?? 0),
    price: course.price || '$0',
    accent: course.accent || '#2563eb',
    image: course.image || fallbackImage(category),
    description: course.description || 'វគ្គសិក្សាថ្មីសម្រាប់អ្នករៀន SmartLearn។',
    lessons,
    quiz: course.quiz?.length ? course.quiz : fallbackQuiz,
    certificateSkills: course.certificateSkills?.length
      ? course.certificateSkills
      : [`${category} workflow`, 'Project practice', 'Problem solving', 'Learning progress'],
    status: course.status || 'Published',
    createdAt: course.createdAt || new Date().toISOString(),
    updatedAt: course.updatedAt || new Date().toISOString(),
  }
}

const customCourses = ref(readCustomCourses().map(hydrateCourse))

function persist(nextCourses) {
  customCourses.value = nextCourses.map(hydrateCourse)
  writeCustomCourses(customCourses.value)
}

export function useCourseCatalog() {
  const publishedCustomCourses = computed(() =>
    customCourses.value.filter((course) => course.status !== 'Draft'),
  )
  const allCourses = computed(() => [...seedCourses, ...publishedCustomCourses.value])
  const adminCourses = computed(() => customCourses.value)

  const catalogSummary = computed(() => {
    const publishedCourses = allCourses.value.length
    const draftCourses = customCourses.value.filter((course) => course.status === 'Draft').length
    const totalStudents = allCourses.value.reduce((total, course) => total + Number(course.students || 0), 0)
    const averageRating = publishedCourses
      ? (
          allCourses.value.reduce((total, course) => total + Number(course.rating || 0), 0) /
          publishedCourses
        ).toFixed(1)
      : '0.0'

    return {
      publishedCourses,
      draftCourses,
      totalStudents,
      averageRating,
    }
  })

  function getCourseById(id) {
    return allCourses.value.find((course) => course.id === id) ?? null
  }

  function createCourse(payload) {
    const course = hydrateCourse({
      ...payload,
      id: makeId(payload.title),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    persist([course, ...customCourses.value])
    return clone(course)
  }

  function updateCourse(id, payload) {
    let updatedCourse = null
    const nextCourses = customCourses.value.map((course) => {
      if (course.id !== id) return course

      updatedCourse = hydrateCourse({
        ...course,
        ...payload,
        id,
        updatedAt: new Date().toISOString(),
      })

      return updatedCourse
    })

    persist(nextCourses)
    return updatedCourse ? clone(updatedCourse) : null
  }

  function deleteCourse(id) {
    const nextCourses = customCourses.value.filter((course) => course.id !== id)
    persist(nextCourses)
  }

  function duplicateCourse(id) {
    const course = customCourses.value.find((item) => item.id === id)
    if (!course) return null

    return createCourse({
      ...course,
      title: `${course.title} Copy`,
      status: 'Draft',
    })
  }

  return {
    adminCourses,
    allCourses,
    catalogSummary,
    createCourse,
    deleteCourse,
    duplicateCourse,
    getCourseById,
    updateCourse,
  }
}
