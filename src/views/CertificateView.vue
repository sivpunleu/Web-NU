<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import { useAuth } from '@/composables/useAuth'
import { useCourseCatalog } from '@/composables/useCourseCatalog'
import { useLearning } from '@/composables/useLearning'
import { useQuiz } from '@/composables/useQuiz'
import { buildCertificateId } from '@/utils/certificate'

const route = useRoute()
const { currentUser } = useAuth()
const { getCourseById } = useCourseCatalog()
const { isCourseComplete } = useLearning()
const { getAttempt } = useQuiz()

const course = computed(() => getCourseById(route.params.courseId))
const attempt = computed(() => (course.value ? getAttempt(course.value.id) : null))
const eligible = computed(() => course.value && isCourseComplete(course.value) && attempt.value?.passed)
const certificateId = computed(() =>
  course.value && attempt.value
    ? buildCertificateId({
        userId: currentUser.value?.id ?? 'unknown',
        courseId: course.value.id,
        submittedAt: attempt.value.submittedAt,
      })
    : 'SL-0000',
)
const issuedDate = computed(() =>
  attempt.value?.submittedAt
    ? new Date(attempt.value.submittedAt).toLocaleDateString()
    : '',
)

function printCertificate() {
  window.print()
}
</script>

<template>
  <section v-if="eligible" class="py-5 certificate-page">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center gap-3 mb-4 no-print">
        <RouterLink class="text-decoration-none fw-bold" to="/my-courses">
          <i class="bi bi-arrow-left me-2"></i>ត្រឡប់ទៅវគ្គរបស់ខ្ញុំ
        </RouterLink>
        <button class="btn btn-primary" type="button" @click="printCertificate">
          <i class="bi bi-printer me-2"></i>Print / Save PDF
        </button>
      </div>

      <div class="certificate-sheet">
        <span class="certificate-kicker">Certificate of Completion</span>
        <h1>វិញ្ញាបនបត្របញ្ចប់វគ្គសិក្សា</h1>
        <p class="certificate-copy">ត្រូវបានផ្តល់ជូន</p>
        <h2>{{ currentUser?.name ?? 'SmartLearn Student' }}</h2>
        <p class="certificate-copy">សម្រាប់ការបញ្ចប់វគ្គ</p>
        <h3>{{ course.title }}</h3>

        <div class="certificate-meta">
          <div>
            <span>ពិន្ទុ Quiz</span>
            <strong>{{ attempt.score }}%</strong>
          </div>
          <div>
            <span>លេខសម្គាល់</span>
            <strong>{{ certificateId }}</strong>
          </div>
          <div>
            <span>កាលបរិច្ឆេទ</span>
            <strong>{{ issuedDate }}</strong>
          </div>
        </div>

        <div class="certificate-skills">
          <span v-for="skill in course.certificateSkills" :key="skill">{{ skill }}</span>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="py-5">
    <div class="container">
      <EmptyState
        icon="bi-award"
        title="Certificate មិនទាន់រួចរាល់"
        message="សូមបញ្ចប់មេរៀនទាំងអស់ និងជាប់ Quiz មុនទទួល certificate។"
      >
        <RouterLink v-if="course" class="btn btn-primary" :to="`/courses/${course.id}`">
          បន្តវគ្គសិក្សា
        </RouterLink>
      </EmptyState>
    </div>
  </section>
</template>
