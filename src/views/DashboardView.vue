<script setup>
import { computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import EmptyState from '@/components/EmptyState.vue'
import ProgressChart from '@/components/ProgressChart.vue'
import { useLearning } from '@/composables/useLearning'

const { enrolledCourses, getCompletedLessonCount, getCourseProgress } = useLearning()

const completedLessons = computed(() =>
  enrolledCourses.value.reduce((total, course) => total + getCompletedLessonCount(course), 0),
)

const weeklyGoal = computed(() => {
  if (!enrolledCourses.value.length) return 0
  const total = enrolledCourses.value.reduce((sum, course) => sum + getCourseProgress(course), 0)
  return Math.round(total / enrolledCourses.value.length)
})

const progressRows = computed(() =>
  enrolledCourses.value.slice(0, 4).map((course) => ({
    id: course.id,
    title: course.title,
    accent: course.accent,
    progress: getCourseProgress(course),
  })),
)
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
              <span class="section-kicker">Dashboard</span>
              <h1 class="section-title mt-2">សួស្តី អាឡិច</h1>
              <p class="text-secondary mb-0">
                តាមដានវឌ្ឍនភាពវគ្គសិក្សា និងគោលដៅប្រចាំសប្តាហ៍។
              </p>
            </div>
            <RouterLink class="btn btn-primary align-self-xl-end" to="/courses">
              <i class="bi bi-plus-circle me-2"></i>បន្ថែមវគ្គ
            </RouterLink>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="dashboard-card">
                <span>វគ្គកំពុងរៀន</span>
                <strong>{{ enrolledCourses.length }}</strong>
              </div>
            </div>
            <div class="col-md-4">
              <div class="dashboard-card dashboard-card--green">
                <span>មេរៀនបានបញ្ចប់</span>
                <strong>{{ completedLessons }}</strong>
              </div>
            </div>
            <div class="col-md-4">
              <div class="dashboard-card dashboard-card--amber">
                <span>គោលដៅសប្តាហ៍</span>
                <strong>{{ weeklyGoal }}%</strong>
              </div>
            </div>
          </div>

          <div v-if="enrolledCourses.length" class="dashboard-progress-grid mb-4">
            <ProgressChart
              :value="weeklyGoal"
              label="វឌ្ឍនភាពសរុប"
              caption="មធ្យមភាគពីវគ្គដែលកំពុងរៀន"
              icon="bi-graph-up-arrow"
              tone="green"
            />

            <div class="content-panel dashboard-progress-panel">
              <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <span class="section-kicker">Progress Chart</span>
                  <h2 class="h4 fw-bold mt-2 mb-0">វគ្គដែលកំពុងដំណើរការ</h2>
                </div>
                <RouterLink class="btn btn-outline-primary btn-sm" to="/my-courses">មើលទាំងអស់</RouterLink>
              </div>

              <div class="dashboard-progress-list">
                <div v-for="item in progressRows" :key="item.id" class="dashboard-progress-item">
                  <div>
                    <strong>{{ item.title }}</strong>
                    <span>{{ item.progress }}%</span>
                  </div>
                  <div class="progress" role="progressbar" :aria-valuenow="item.progress">
                    <div
                      class="progress-bar"
                      :style="{ width: `${item.progress}%`, backgroundColor: item.accent }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="enrolledCourses.length" class="content-panel">
            <h2 class="h4 fw-bold mb-4">បន្តការសិក្សា</h2>
            <div class="vstack gap-3">
              <article v-for="course in enrolledCourses" :key="course.id" class="learning-row">
                <div>
                  <h3 class="h6 fw-bold mb-1">{{ course.title }}</h3>
                  <p class="text-secondary mb-0">
                    {{ course.instructor }} • {{ course.duration }}
                  </p>
                </div>
                <div class="progress flex-grow-1" role="progressbar" :aria-valuenow="getCourseProgress(course)">
                  <div
                    class="progress-bar"
                    :style="{ width: `${getCourseProgress(course)}%`, backgroundColor: course.accent }"
                  >
                    {{ getCourseProgress(course) }}%
                  </div>
                </div>
                <RouterLink class="btn btn-outline-primary btn-sm" :to="`/courses/${course.id}/lessons/0`">
                  បើក
                </RouterLink>
              </article>
            </div>
          </div>

          <EmptyState
            v-else
            icon="bi-speedometer2"
            title="Dashboard ទទេ"
            message="ចុះឈ្មោះវគ្គសិក្សាមួយ ដើម្បីចាប់ផ្តើមតាមដានវឌ្ឍនភាព។"
          >
            <RouterLink class="btn btn-primary" to="/courses">រកវគ្គសិក្សា</RouterLink>
          </EmptyState>
        </div>
      </div>
    </div>
  </section>
</template>
