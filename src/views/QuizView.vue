<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import { useCourseCatalog } from '@/composables/useCourseCatalog'
import { useLearning } from '@/composables/useLearning'
import { useQuiz } from '@/composables/useQuiz'

const route = useRoute()
const { getCourseById } = useCourseCatalog()
const { isCourseComplete } = useLearning()
const { PASS_SCORE, getAttempt, getQuiz, resetQuiz, submitQuiz } = useQuiz()

const course = computed(() => getCourseById(route.params.courseId))
const quiz = computed(() => (course.value ? getQuiz(course.value.id) : []))
const savedAttempt = computed(() => (course.value ? getAttempt(course.value.id) : null))
const answers = reactive({})
const result = ref(null)

const courseComplete = computed(() => (course.value ? isCourseComplete(course.value) : false))
const canSubmit = computed(() => quiz.value.every((_, index) => answers[index] !== undefined))
const certificateReady = computed(
  () => course.value && isCourseComplete(course.value) && (result.value?.passed || savedAttempt.value?.passed),
)

function submit() {
  if (!course.value || !canSubmit.value) return
  result.value = submitQuiz(course.value.id, { ...answers })
}

function retry() {
  if (!course.value) return
  Object.keys(answers).forEach((key) => delete answers[key])
  result.value = null
  resetQuiz(course.value.id)
}
</script>

<template>
  <section v-if="course && courseComplete" class="py-5">
    <div class="container">
      <RouterLink class="text-decoration-none fw-bold" :to="`/courses/${course.id}`">
        <i class="bi bi-arrow-left me-2"></i>ត្រឡប់ទៅវគ្គ
      </RouterLink>

      <div class="quiz-hero mt-4">
        <div>
          <span class="section-kicker">Quiz / Exam</span>
          <h1 class="section-title mt-2 mb-2">{{ course.title }}</h1>
          <p class="text-secondary mb-0">
            ឆ្លើយសំណួរខាងក្រោម។ ត្រូវការ {{ PASS_SCORE }}% ឡើងទៅដើម្បីជាប់។
          </p>
        </div>
        <div class="quiz-score-pill">
          <span>Last score</span>
          <strong>{{ savedAttempt?.score ?? 0 }}%</strong>
        </div>
      </div>

      <div class="row g-4 mt-1">
        <div class="col-lg-8">
          <form class="vstack gap-4" @submit.prevent="submit">
            <article v-for="(question, index) in quiz" :key="question.question" class="content-panel">
              <div class="d-flex gap-3">
                <span class="question-number">{{ index + 1 }}</span>
                <div class="flex-grow-1">
                  <h2 class="h5 fw-bold mb-3">{{ question.question }}</h2>

                  <div class="vstack gap-2">
                    <label
                      v-for="(option, optionIndex) in question.options"
                      :key="option"
                      class="quiz-option"
                    >
                      <input
                        v-model="answers[index]"
                        class="form-check-input"
                        type="radio"
                        :name="`question-${index}`"
                        :value="optionIndex"
                      />
                      <span>{{ option }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </article>

            <div class="d-flex flex-column flex-md-row gap-2">
              <button class="btn btn-primary btn-lg" type="submit" :disabled="!canSubmit">
                ដាក់ស្នើ Quiz
              </button>
              <button class="btn btn-outline-secondary btn-lg" type="button" @click="retry">
                ធ្វើម្ដងទៀត
              </button>
            </div>
          </form>
        </div>

        <div class="col-lg-4">
          <aside class="content-panel quiz-result-panel">
            <h2 class="h5 fw-bold mb-3">លទ្ធផល</h2>
            <div v-if="result || savedAttempt" class="quiz-result">
              <strong>{{ result?.score ?? savedAttempt.score }}%</strong>
              <span :class="(result?.passed ?? savedAttempt.passed) ? 'text-success' : 'text-warning'">
                {{ (result?.passed ?? savedAttempt.passed) ? 'ជាប់' : 'មិនទាន់ជាប់' }}
              </span>
              <p class="text-secondary mb-0">
                ត្រូវ {{ result?.correctAnswers ?? savedAttempt.correctAnswers }} ក្នុងចំណោម
                {{ quiz.length }} សំណួរ។
              </p>
            </div>
            <p v-else class="text-secondary">លទ្ធផលនឹងបង្ហាញនៅទីនេះបន្ទាប់ពីអ្នក submit។</p>

            <RouterLink
              v-if="certificateReady"
              class="btn btn-success w-100 mt-3"
              :to="`/courses/${course.id}/certificate`"
            >
              <i class="bi bi-award me-2"></i>មើល Certificate
            </RouterLink>

            <RouterLink v-else class="btn btn-outline-primary w-100 mt-3" :to="`/courses/${course.id}`">
              ពិនិត្យមេរៀន
            </RouterLink>
          </aside>
        </div>
      </div>
    </div>
  </section>

  <section v-else-if="course" class="py-5">
    <div class="container">
      <EmptyState
        icon="bi-journal-check"
        title="Quiz មិនទាន់បើក"
        message="សូមបញ្ចប់មេរៀនទាំងអស់ក្នុងវគ្គនេះ មុនពេលធ្វើ Quiz។"
      >
        <RouterLink class="btn btn-primary" :to="`/courses/${course.id}`">
          បន្តមេរៀន
        </RouterLink>
      </EmptyState>
    </div>
  </section>

  <section v-else class="py-5">
    <div class="container">
      <EmptyState
        icon="bi-question-circle"
        title="រកមិនឃើញ Quiz"
        message="Quiz សម្រាប់វគ្គនេះមិនមានទេ។"
      >
        <RouterLink class="btn btn-primary" to="/courses">មើលវគ្គសិក្សា</RouterLink>
      </EmptyState>
    </div>
  </section>
</template>
