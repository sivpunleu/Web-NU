<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CourseCard from '@/components/CourseCard.vue'
import DiscussionPanel from '@/components/DiscussionPanel.vue'
import { useAuth } from '@/composables/useAuth'
import { useCourseCatalog } from '@/composables/useCourseCatalog'
import { useCourseReviews } from '@/composables/useCourseReviews'
import { useLearning } from '@/composables/useLearning'
import { useQuiz } from '@/composables/useQuiz'
import { lessonDuration, lessonSummary, lessonTitle } from '@/utils/lessonContent'

const route = useRoute()
const router = useRouter()
const { currentUser, isAuthenticated } = useAuth()
const { allCourses, getCourseById } = useCourseCatalog()
const {
  enrollCourse,
  isCourseComplete,
  isEnrolled,
  isFavorite,
  isLessonComplete,
  toggleFavorite,
} = useLearning()
const { getAttempt } = useQuiz()
const { addReview, getAverageRating, getCourseReviews, hasUserReviewed } = useCourseReviews()

const reviewForm = reactive({
  rating: 5,
  text: '',
})
const reviewMessage = ref('')

const course = computed(() => getCourseById(route.params.id))
const enrolled = computed(() => (course.value ? isEnrolled(course.value.id) : false))
const favorite = computed(() => (course.value ? isFavorite(course.value.id) : false))
const quizPassed = computed(() => (course.value ? getAttempt(course.value.id)?.passed : false))
const certificateReady = computed(() => course.value && isCourseComplete(course.value) && quizPassed.value)
const courseReviews = computed(() => (course.value ? getCourseReviews(course.value.id) : []))
const reviewed = computed(() => (course.value ? hasUserReviewed(course.value.id) : false))
const canReview = computed(() => isAuthenticated.value && enrolled.value && !reviewed.value)
const averageReviewRating = computed(() =>
  course.value ? getAverageRating(course.value.id, course.value.rating) : '0.0',
)

const relatedCourses = computed(() => {
  if (!course.value) return []

  return allCourses.value
    .filter((item) => item.id !== course.value.id && item.category === course.value.category)
    .slice(0, 3)
})

function enrollCurrentCourse() {
  if (!course.value) return
  if (!isAuthenticated.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  enrollCourse(course.value.id)
}

function toggleCurrentFavorite() {
  if (!course.value) return
  if (!isAuthenticated.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }
  toggleFavorite(course.value.id)
}

function submitReview() {
  if (!course.value || !canReview.value || !reviewForm.text.trim()) return

  const review = addReview(course.value.id, {
    rating: reviewForm.rating,
    text: reviewForm.text.trim(),
  })
  if (!review) return

  reviewForm.rating = 5
  reviewForm.text = ''
  reviewMessage.value = 'មតិយោបល់របស់អ្នកត្រូវបានបន្ថែមរួចហើយ។'
}
</script>

<template>
  <section v-if="course" class="py-5">
    <div class="container">
      <RouterLink class="text-decoration-none fw-bold" to="/courses">
        <i class="bi bi-arrow-left me-2"></i>ត្រឡប់ទៅវគ្គសិក្សា
      </RouterLink>

      <div class="course-detail-hero mt-4" :style="{ '--course-accent': course.accent }">
        <div class="row g-4 align-items-center">
          <div class="col-lg-7">
            <span class="badge text-bg-light mb-3">{{ course.category }}</span>
            <h1 class="display-5 fw-bold text-white mb-3">{{ course.title }}</h1>
            <p class="lead text-white-75 mb-4">{{ course.description }}</p>

            <div class="d-flex flex-column flex-sm-row gap-2">
              <button class="btn btn-light btn-lg" type="button" :disabled="enrolled" @click="enrollCurrentCourse">
                <i class="bi me-2" :class="enrolled ? 'bi-check-circle-fill' : 'bi-plus-circle'"></i>
                {{ enrolled ? 'បានចុះឈ្មោះរួច' : 'ចុះឈ្មោះរៀន' }}
              </button>

              <RouterLink class="btn btn-outline-light btn-lg" :to="`/courses/${course.id}/lessons/0`">
                <i class="bi bi-play-circle me-2"></i>ចាប់ផ្តើមមេរៀន
              </RouterLink>

              <button class="btn btn-outline-light btn-lg" type="button" @click="toggleCurrentFavorite">
                <i class="bi me-2" :class="favorite ? 'bi-bookmark-fill' : 'bi-bookmark'"></i>
                {{ favorite ? 'បានរក្សាទុក' : 'រក្សាទុក' }}
              </button>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="detail-image-card">
              <img v-if="course.image" :src="course.image" :alt="course.title" />
            </div>
            <div class="detail-price-card mt-3">
              <span class="text-secondary">តម្លៃវគ្គ</span>
              <strong>{{ course.price }}</strong>
              <div class="d-grid gap-2 mt-3">
                <RouterLink class="btn btn-primary" to="/my-courses">ទៅវគ្គរបស់ខ្ញុំ</RouterLink>
                <RouterLink class="btn btn-outline-primary" :to="`/courses/${course.id}/quiz`">
                  ធ្វើ Quiz
                </RouterLink>
                <RouterLink class="btn btn-outline-primary" :to="`/courses/${course.id}/lessons/0/lab`">
                  <i class="bi bi-terminal me-2"></i>Practice Lab
                </RouterLink>
                <RouterLink
                  v-if="certificateReady"
                  class="btn btn-success"
                  :to="`/courses/${course.id}/certificate`"
                >
                  មើល Certificate
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mt-1">
        <div class="col-lg-8">
          <div class="content-panel h-100">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
              <div>
                <span class="section-kicker">មេរៀន</span>
                <h2 class="h4 fw-bold mt-2 mb-0">អ្វីដែលអ្នកនឹងរៀន</h2>
              </div>
              <span class="badge text-bg-primary align-self-md-start">
                {{ course.lessons.length }} មេរៀនសំខាន់
              </span>
            </div>

            <div class="vstack gap-3">
              <RouterLink
                v-for="(lesson, index) in course.lessons"
                :key="lessonTitle(lesson)"
                class="lesson-row lesson-row--link text-decoration-none"
                :to="`/courses/${course.id}/lessons/${index}`"
              >
                <span class="lesson-row__number">{{ index + 1 }}</span>
                <span class="lesson-row__content">
                  <strong>{{ lessonTitle(lesson) }}</strong>
                  <small>{{ lessonSummary(lesson, course) }}</small>
                </span>
                <span class="lesson-row__duration">
                  <i class="bi bi-clock"></i>{{ lessonDuration(lesson) }}
                </span>
                <i
                  class="bi ms-auto"
                  :class="
                    isLessonComplete(course.id, index)
                      ? 'bi-check-circle-fill text-success'
                      : 'bi-play-circle text-primary'
                  "
                ></i>
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="content-panel h-100">
            <h2 class="h5 fw-bold mb-3">ព័ត៌មានសង្ខេប</h2>
            <div class="detail-meta">
              <div>
                <span>គ្រូបង្រៀន</span>
                <strong>{{ course.instructor }}</strong>
              </div>
              <div>
                <span>កម្រិត</span>
                <strong>{{ course.level }}</strong>
              </div>
              <div>
                <span>រយៈពេល</span>
                <strong>{{ course.duration }}</strong>
              </div>
              <div>
                <span>សិស្ស</span>
                <strong>{{ course.students }}</strong>
              </div>
              <div>
                <span>Quiz</span>
                <strong>{{ quizPassed ? 'ជាប់' : 'មិនទាន់ជាប់' }}</strong>
              </div>
              <div>
                <span>Rating</span>
                <strong>{{ averageReviewRating }} ★</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="mt-5">
        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <span class="section-kicker">មតិយោបល់</span>
            <h2 class="h3 fw-bold mt-2 mb-0">សិស្សនិយាយអំពីវគ្គនេះ</h2>
          </div>
          <div class="review-summary-pill">
            <i class="bi bi-star-fill"></i>
            <strong>{{ averageReviewRating }}</strong>
            <span>{{ courseReviews.length }} reviews</span>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-5">
            <form v-if="canReview" class="review-form-card" @submit.prevent="submitReview">
              <h3 class="h5 fw-bold mb-3">បន្ថែមមតិយោបល់</h3>
              <div class="vstack gap-3">
                <p class="text-secondary mb-0">បង្ហោះជា {{ currentUser.name }}</p>
                <label class="form-label">
                  ផ្កាយ
                  <select v-model.number="reviewForm.rating" class="form-select">
                    <option v-for="rating in 5" :key="rating" :value="rating">{{ rating }} ផ្កាយ</option>
                  </select>
                </label>
                <label class="form-label">
                  មតិយោបល់
                  <textarea
                    v-model="reviewForm.text"
                    class="form-control"
                    rows="4"
                    placeholder="ចែករំលែកបទពិសោធន៍របស់អ្នក..."
                    required
                  ></textarea>
                </label>
                <button class="btn btn-primary" type="submit">
                  <i class="bi bi-send me-2"></i>ផ្ញើមតិ
                </button>
              </div>
            </form>
            <div v-else class="review-form-card">
              <h3 class="h5 fw-bold mb-3">បន្ថែមមតិយោបល់</h3>
              <p v-if="reviewed" class="text-secondary mb-0">
                អ្នកបានផ្ញើមតិយោបល់សម្រាប់វគ្គនេះរួចហើយ។
              </p>
              <template v-else-if="!isAuthenticated">
                <p class="text-secondary">សូមចូលគណនីមុនពេលផ្ញើមតិយោបល់។</p>
                <RouterLink
                  class="btn btn-primary"
                  :to="{ path: '/login', query: { redirect: route.fullPath } }"
                >
                  ចូលគណនី
                </RouterLink>
              </template>
              <template v-else>
                <p class="text-secondary">សូមចុះឈ្មោះរៀនវគ្គនេះសិន ដើម្បីផ្ញើមតិយោបល់។</p>
                <button class="btn btn-primary" type="button" @click="enrollCurrentCourse">
                  ចុះឈ្មោះរៀន
                </button>
              </template>
              <p v-if="reviewMessage" class="text-success mt-3 mb-0">{{ reviewMessage }}</p>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="row g-4">
              <div v-for="review in courseReviews" :key="review.id" class="col-md-6">
                <article class="review-card">
                  <div class="d-flex justify-content-between gap-3 mb-3">
                    <div>
                      <h3 class="h6 fw-bold mb-1">{{ review.name }}</h3>
                      <p class="small text-secondary mb-0">{{ review.role }}</p>
                    </div>
                    <span class="text-warning fw-bold">
                      <i class="bi bi-star-fill me-1"></i>{{ review.rating }}
                    </span>
                  </div>
                  <p class="text-secondary mb-0">{{ review.text }}</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DiscussionPanel class="mt-5" :course-id="course.id" />

      <section v-if="relatedCourses.length" class="mt-5">
        <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <span class="section-kicker">វគ្គពាក់ព័ន្ធ</span>
            <h2 class="h3 fw-bold mt-2 mb-0">អ្នកអាចចាប់អារម្មណ៍</h2>
          </div>
          <RouterLink class="btn btn-outline-primary align-self-md-end" to="/courses">
            មើលវគ្គទាំងអស់
          </RouterLink>
        </div>

        <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
          <div v-for="relatedCourse in relatedCourses" :key="relatedCourse.id" class="col">
            <CourseCard :course="relatedCourse" />
          </div>
        </div>
      </section>
    </div>
  </section>

  <section v-else class="py-5">
    <div class="container">
      <div class="empty-panel text-center">
        <i class="bi bi-exclamation-circle display-5 text-primary"></i>
        <h1 class="h3 fw-bold mt-3">រកមិនឃើញវគ្គសិក្សា</h1>
        <p class="text-secondary">វគ្គដែលអ្នកកំពុងស្វែងរក មិនមានក្នុងប្រព័ន្ធទេ។</p>
        <RouterLink class="btn btn-primary" to="/courses">មើលវគ្គទាំងអស់</RouterLink>
      </div>
    </div>
  </section>
</template>
