import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const STORAGE_KEY = 'smartlearn_course_reviews'

const defaultReviews = [
  {
    id: 'default-sophea',
    name: 'សុភា',
    role: 'Frontend Student',
    rating: 5,
    text: 'មេរៀនរៀបចំបានច្បាស់ មានលំហាត់អនុវត្ត ហើយងាយតាមដាន។',
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'default-visal',
    name: 'វិសាល',
    role: 'Web Developer',
    rating: 4,
    text: 'ចូលចិត្តការពន្យល់ជាភាសាខ្មែរ និង project structure ក្នុងវគ្គនេះ។',
    createdAt: '2026-02-18T00:00:00.000Z',
  },
]

function readReviews() {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function writeReviews(value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

const storedReviews = ref(readReviews())

export function useCourseReviews() {
  const { currentUser } = useAuth()

  function getCourseReviews(courseId) {
    return [...defaultReviews, ...(storedReviews.value[courseId] ?? [])]
  }

  function addReview(courseId, review) {
    if (!currentUser.value || hasUserReviewed(courseId)) return null

    const nextReview = {
      id: `review-${Date.now()}`,
      userId: currentUser.value.id,
      name: currentUser.value.name,
      role: currentUser.value.role === 'admin' ? 'Admin' : 'Student',
      rating: Number(review.rating || 5),
      text: review.text,
      createdAt: new Date().toISOString(),
    }

    storedReviews.value = {
      ...storedReviews.value,
      [courseId]: [nextReview, ...(storedReviews.value[courseId] ?? [])],
    }
    writeReviews(storedReviews.value)

    return nextReview
  }

  function hasUserReviewed(courseId) {
    if (!currentUser.value) return false
    return (storedReviews.value[courseId] ?? []).some(
      (review) => review.userId === currentUser.value.id,
    )
  }

  function getAverageRating(courseId, fallback = 0) {
    const userReviews = storedReviews.value[courseId] ?? []
    if (!userReviews.length && fallback) return Number(fallback || 0).toFixed(1)

    const reviews = getCourseReviews(courseId)
    if (!reviews.length) return Number(fallback || 0).toFixed(1)

    const average = reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / reviews.length
    return average.toFixed(1)
  }

  const totalStoredReviews = computed(() =>
    Object.values(storedReviews.value).reduce((total, reviews) => total + reviews.length, 0),
  )

  return {
    addReview,
    getAverageRating,
    getCourseReviews,
    hasUserReviewed,
    totalStoredReviews,
  }
}
