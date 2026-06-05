<script setup>
import CourseCard from '@/components/CourseCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useLearning } from '@/composables/useLearning'
import { useQuiz } from '@/composables/useQuiz'

const {
  enrolledCourses,
  favoriteCourses,
  getCourseProgress,
  isCourseComplete,
  isLessonComplete,
  unenrollCourse,
} = useLearning()
const { getAttempt } = useQuiz()
</script>

<template>
  <section class="py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-3">
          <Sidebar />
        </div>

        <div class="col-lg-9">
          <div class="d-flex flex-column flex-xl-row justify-content-between gap-3 mb-4">
            <div>
              <span class="section-kicker">My Courses</span>
              <h1 class="section-title mt-2">វគ្គសិក្សារបស់ខ្ញុំ</h1>
              <p class="text-secondary mb-0">
                គ្រប់គ្រងវគ្គដែលបានចុះឈ្មោះ មើល progress detail និងទទួល certificate។
              </p>
            </div>
            <RouterLink class="btn btn-primary align-self-xl-end" to="/courses">
              <i class="bi bi-plus-circle me-2"></i>ស្វែងរកវគ្គថ្មី
            </RouterLink>
          </div>

          <div v-if="enrolledCourses.length" class="content-panel mb-5">
            <h2 class="h4 fw-bold mb-4">កំពុងរៀន</h2>

            <div class="vstack gap-3">
              <article v-for="course in enrolledCourses" :key="course.id" class="my-course-row">
                <img v-if="course.image" :src="course.image" :alt="course.title" />

                <div>
                  <h3 class="h5 fw-bold mb-1">{{ course.title }}</h3>
                  <p class="text-secondary mb-2">
                    {{ course.instructor }} • {{ course.lessons.length }} មេរៀនសំខាន់ •
                    Quiz {{ getAttempt(course.id)?.passed ? 'ជាប់' : 'មិនទាន់ជាប់' }}
                  </p>
                  <div class="progress" role="progressbar" :aria-valuenow="getCourseProgress(course)">
                    <div
                      class="progress-bar"
                      :style="{ width: `${getCourseProgress(course)}%`, backgroundColor: course.accent }"
                    >
                      {{ getCourseProgress(course) }}%
                    </div>
                  </div>

                  <div class="lesson-progress-list mt-3">
                    <RouterLink
                      v-for="(lesson, index) in course.lessons"
                      :key="`${course.id}-${index}`"
                      class="lesson-progress-chip"
                      :class="{ complete: isLessonComplete(course.id, index) }"
                      :to="`/courses/${course.id}/lessons/${index}`"
                    >
                      {{ index + 1 }}
                    </RouterLink>
                  </div>
                </div>

                <div class="my-course-row__actions">
                  <RouterLink class="btn btn-outline-primary btn-sm" :to="`/courses/${course.id}/lessons/0`">
                    រៀនបន្ត
                  </RouterLink>
                  <RouterLink class="btn btn-outline-success btn-sm" :to="`/courses/${course.id}/quiz`">
                    Quiz
                  </RouterLink>
                  <RouterLink
                    v-if="isCourseComplete(course) && getAttempt(course.id)?.passed"
                    class="btn btn-success btn-sm"
                    :to="`/courses/${course.id}/certificate`"
                  >
                    Certificate
                  </RouterLink>
                  <button class="btn btn-outline-danger btn-sm" type="button" @click="unenrollCourse(course.id)">
                    ដកចេញ
                  </button>
                </div>
              </article>
            </div>
          </div>

          <EmptyState
            v-else
            icon="bi-collection-play"
            title="អ្នកមិនទាន់មានវគ្គសិក្សា"
            message="ចុះឈ្មោះវគ្គមួយ ដើម្បីឲ្យវាបង្ហាញនៅទីនេះ។"
          >
            <RouterLink class="btn btn-primary" to="/courses">មើលវគ្គសិក្សា</RouterLink>
          </EmptyState>

          <section class="mt-5">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
              <div>
                <span class="section-kicker">Saved</span>
                <h2 class="h3 fw-bold mt-2 mb-0">វគ្គដែលបានរក្សាទុក</h2>
              </div>
            </div>

            <div v-if="favoriteCourses.length" class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              <div v-for="course in favoriteCourses" :key="course.id" class="col">
                <CourseCard :course="course" />
              </div>
            </div>

            <EmptyState
              v-else
              icon="bi-bookmark"
              title="មិនទាន់មានវគ្គបានរក្សាទុក"
              message="ចុច bookmark លើ course card ដើម្បីរក្សាទុកវគ្គដែលអ្នកចាប់អារម្មណ៍។"
            />
          </section>
        </div>
      </div>
    </div>
  </section>
</template>
