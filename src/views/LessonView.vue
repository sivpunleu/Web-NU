<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DiscussionPanel from '@/components/DiscussionPanel.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useCourseCatalog } from '@/composables/useCourseCatalog'
import { useLearning } from '@/composables/useLearning'
import {
  lessonChapters,
  lessonDeliverable,
  lessonDuration,
  lessonObjectives,
  lessonPractice,
  lessonResources,
  lessonSteps,
  lessonSummary,
  lessonTitle as getLessonTitle,
} from '@/utils/lessonContent'

const route = useRoute()
const { getCourseById } = useCourseCatalog()
const { getCourseProgress, isLessonComplete, markLessonComplete } = useLearning()

const course = computed(() => getCourseById(route.params.courseId))
const lessonIndex = computed(() => Number(route.params.lessonIndex))
const currentLesson = computed(() => course.value?.lessons[lessonIndex.value])
const lessonTitle = computed(() => (currentLesson.value ? getLessonTitle(currentLesson.value) : ''))
const lessonMeta = computed(() => (currentLesson.value ? lessonDuration(currentLesson.value) : ''))
const lessonIntro = computed(() => (currentLesson.value ? lessonSummary(currentLesson.value, course.value) : ''))
const objectives = computed(() => lessonObjectives(currentLesson.value, course.value))
const steps = computed(() => lessonSteps(currentLesson.value))
const practice = computed(() => lessonPractice(currentLesson.value, course.value))
const deliverable = computed(() => lessonDeliverable(currentLesson.value))
const resources = computed(() => lessonResources(currentLesson.value))
const chapters = computed(() => lessonChapters(currentLesson.value))
const hasPreviousLesson = computed(() => lessonIndex.value > 0)
const hasNextLesson = computed(() => course.value && lessonIndex.value < course.value.lessons.length - 1)

const previousLessonPath = computed(() => {
  if (!course.value || !hasPreviousLesson.value) return ''
  return `/courses/${course.value.id}/lessons/${lessonIndex.value - 1}`
})

const nextLessonPath = computed(() => {
  if (!course.value || !hasNextLesson.value) return ''
  return `/courses/${course.value.id}/lessons/${lessonIndex.value + 1}`
})

function completeLesson() {
  if (!course.value || !lessonTitle.value) return
  markLessonComplete(course.value.id, lessonIndex.value)
}
</script>

<template>
  <section v-if="course && lessonTitle" class="py-5">
    <div class="container">
      <RouterLink class="text-decoration-none fw-bold" :to="`/courses/${course.id}`">
        <i class="bi bi-arrow-left me-2"></i>ត្រឡប់ទៅវគ្គ
      </RouterLink>

      <div class="row g-4 mt-2">
        <div class="col-lg-8">
          <div class="lesson-player">
            <div class="lesson-player__screen">
              <div class="lesson-player__topbar">
                <span><i class="bi bi-record-circle"></i> Recorded lesson</span>
                <span>{{ lessonMeta }}</span>
              </div>
              <i class="bi bi-camera-video-fill lesson-player__video-icon"></i>
              <span class="lesson-player__meta">{{ course.category }} • {{ lessonMeta }}</span>
              <div class="lesson-player__timeline">
                <span></span>
              </div>
            </div>
          </div>

          <div class="content-panel mt-4">
            <span class="section-kicker">មេរៀនទី {{ lessonIndex + 1 }}</span>
            <h1 class="h3 fw-bold mt-2">{{ lessonTitle }}</h1>
            <p class="text-secondary mb-4">
              {{ lessonIntro }}
            </p>

            <div class="lesson-detail-grid mb-4">
              <article class="lesson-detail-card">
                <div class="lesson-detail-card__icon">
                  <i class="bi bi-bullseye"></i>
                </div>
                <div>
                  <h2>គោលដៅរៀន</h2>
                  <ul>
                    <li v-for="objective in objectives" :key="objective">{{ objective }}</li>
                  </ul>
                </div>
              </article>

              <article class="lesson-detail-card">
                <div class="lesson-detail-card__icon lesson-detail-card__icon--green">
                  <i class="bi bi-list-check"></i>
                </div>
                <div>
                  <h2>ជំហានអនុវត្ត</h2>
                  <ol>
                    <li v-for="step in steps" :key="step">{{ step }}</li>
                  </ol>
                </div>
              </article>
            </div>

            <div class="lesson-practice-panel mb-4">
              <div>
                <span class="section-kicker">Practice</span>
                <h2 class="h5 fw-bold mt-2">លំហាត់សម្រាប់មេរៀននេះ</h2>
                <p class="text-secondary mb-0">{{ practice }}</p>
              </div>
              <div class="lesson-practice-actions">
                <div class="lesson-deliverable">
                  <i class="bi bi-clipboard-check"></i>
                  <span>{{ deliverable }}</span>
                </div>
                <RouterLink class="btn btn-primary" :to="`/courses/${course.id}/lessons/${lessonIndex}/lab`">
                  <i class="bi bi-terminal me-2"></i>បើក Practice Lab
                </RouterLink>
              </div>
            </div>

            <div class="lesson-support-grid mb-4">
              <article class="lesson-chapters-card">
                <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <span class="section-kicker">Video chapters</span>
                    <h2 class="h5 fw-bold mt-2 mb-0">លំដាប់មាតិកា</h2>
                  </div>
                  <i class="bi bi-camera-video text-primary"></i>
                </div>

                <ol class="lesson-chapter-list">
                  <li v-for="chapter in chapters" :key="`${chapter.time}-${chapter.title}`">
                    <span>{{ chapter.time }}</span>
                    <strong>{{ chapter.title }}</strong>
                  </li>
                </ol>
              </article>

              <article class="lesson-resources-card">
                <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <span class="section-kicker">Resources</span>
                    <h2 class="h5 fw-bold mt-2 mb-0">ឯកសារជំនួយ</h2>
                  </div>
                  <i class="bi bi-folder2-open text-success"></i>
                </div>

                <div class="lesson-resource-list">
                  <div v-for="resource in resources" :key="resource.title" class="lesson-resource-item">
                    <i class="bi" :class="resource.icon"></i>
                    <span>
                      <strong>{{ resource.title }}</strong>
                      <small>{{ resource.meta }}</small>
                    </span>
                  </div>
                </div>
              </article>
            </div>

            <div class="d-flex flex-column flex-md-row gap-2">
              <button
                class="btn btn-primary"
                type="button"
                :disabled="isLessonComplete(course.id, lessonIndex)"
                @click="completeLesson"
              >
                <i
                  class="bi me-2"
                  :class="isLessonComplete(course.id, lessonIndex) ? 'bi-check-circle-fill' : 'bi-check-circle'"
                ></i>
                {{ isLessonComplete(course.id, lessonIndex) ? 'បានបញ្ចប់រួច' : 'Mark Complete' }}
              </button>

              <RouterLink v-if="hasPreviousLesson" class="btn btn-outline-secondary" :to="previousLessonPath">
                មេរៀនមុន
              </RouterLink>
              <RouterLink v-if="hasNextLesson" class="btn btn-outline-primary" :to="nextLessonPath">
                មេរៀនបន្ទាប់
              </RouterLink>
              <RouterLink v-else class="btn btn-success" :to="`/courses/${course.id}/quiz`">
                ធ្វើ Quiz
              </RouterLink>
            </div>
          </div>

          <DiscussionPanel class="mt-4" :course-id="course.id" :lesson-title="lessonTitle" />
        </div>

        <div class="col-lg-4">
          <aside class="content-panel lesson-sidebar">
            <div class="d-flex justify-content-between align-items-center gap-3 mb-3">
              <h2 class="h5 fw-bold mb-0">មាតិកាវគ្គ</h2>
              <span class="badge text-bg-primary">{{ getCourseProgress(course) }}%</span>
            </div>

            <div class="progress mb-4" role="progressbar" :aria-valuenow="getCourseProgress(course)">
              <div
                class="progress-bar"
                :style="{ width: `${getCourseProgress(course)}%`, backgroundColor: course.accent }"
              ></div>
            </div>

            <div class="vstack gap-2">
              <RouterLink
                v-for="(lesson, index) in course.lessons"
                :key="getLessonTitle(lesson)"
                class="lesson-nav-item"
                :class="{ active: index === lessonIndex }"
                :to="`/courses/${course.id}/lessons/${index}`"
              >
                <span>{{ index + 1 }}</span>
                <strong>{{ getLessonTitle(lesson) }}</strong>
                <i
                  class="bi ms-auto"
                  :class="
                    isLessonComplete(course.id, index)
                      ? 'bi-check-circle-fill text-success'
                      : 'bi-circle text-secondary'
                  "
                ></i>
              </RouterLink>
              <RouterLink class="lesson-nav-item lesson-nav-item--quiz" :to="`/courses/${course.id}/quiz`">
                <span><i class="bi bi-question-lg"></i></span>
                <strong>Quiz / Exam</strong>
                <i class="bi bi-arrow-right ms-auto"></i>
              </RouterLink>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="py-5">
    <div class="container">
      <EmptyState
        icon="bi-exclamation-circle"
        title="រកមិនឃើញមេរៀន"
        message="មេរៀនដែលអ្នកកំពុងស្វែងរក មិនមានក្នុងវគ្គនេះទេ។"
      >
        <RouterLink class="btn btn-primary" to="/courses">មើលវគ្គសិក្សា</RouterLink>
      </EmptyState>
    </div>
  </section>
</template>
