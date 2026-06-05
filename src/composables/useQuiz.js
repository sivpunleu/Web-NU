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

const STORAGE_KEY = 'smartlearn_quiz_attempts'
const PASS_SCORE = 70

function readStorage() {
  const migrateLegacy = getStoredSession()?.email === 'alex@example.com'
  return readScopedStorage(STORAGE_KEY, {}, { migrateLegacy })
}

function writeStorage(value) {
  writeScopedStorage(STORAGE_KEY, value)
}

const quizAttempts = ref(readStorage())
let storageOwner = getActiveUserId()

subscribeToUserStorage(() => {
  const nextOwner = getActiveUserId()
  if (nextOwner === storageOwner) return

  storageOwner = nextOwner
  quizAttempts.value = readStorage()
})

export function useQuiz() {
  const { addNotification } = useNotifications()
  const { getCourseById } = useCourseCatalog()

  function getQuiz(courseId) {
    return getCourseById(courseId)?.quiz ?? []
  }

  function getAttempt(courseId) {
    const attempt = quizAttempts.value[courseId]
    const quiz = getQuiz(courseId)
    if (!attempt || !quiz.length || !attempt.answers) return null

    const correctAnswers = quiz.reduce((total, question, index) => {
      return total + (attempt.answers[index] === question.answer ? 1 : 0)
    }, 0)
    const score = Math.round((correctAnswers / quiz.length) * 100)

    return {
      ...attempt,
      correctAnswers,
      score,
      passed: score >= PASS_SCORE,
    }
  }

  function submitQuiz(courseId, answers) {
    const quiz = getQuiz(courseId)
    if (!quiz.length || quiz.some((_, index) => answers[index] === undefined)) return null

    const correctAnswers = quiz.reduce((total, question, index) => {
      return total + (answers[index] === question.answer ? 1 : 0)
    }, 0)
    const score = quiz.length ? Math.round((correctAnswers / quiz.length) * 100) : 0
    const passed = score >= PASS_SCORE

    const attempt = {
      answers,
      correctAnswers,
      passed,
      score,
      submittedAt: new Date().toISOString(),
    }

    quizAttempts.value = {
      ...quizAttempts.value,
      [courseId]: attempt,
    }
    writeStorage(quizAttempts.value)

    addNotification({
      title: passed ? 'អ្នកបានជាប់ Quiz' : 'Quiz ត្រូវការព្យាយាមម្ដងទៀត',
      message: `ពិន្ទុរបស់អ្នកគឺ ${score}%។`,
      type: passed ? 'success' : 'warning',
      to: `/courses/${courseId}/quiz`,
    })

    return attempt
  }

  function resetQuiz(courseId) {
    const nextAttempts = { ...quizAttempts.value }
    delete nextAttempts[courseId]
    quizAttempts.value = nextAttempts
    writeStorage(quizAttempts.value)
  }

  const passedQuizIds = computed(() =>
    Object.keys(quizAttempts.value).filter((courseId) => getAttempt(courseId)?.passed),
  )

  return {
    PASS_SCORE,
    passedQuizIds,
    quizAttempts,
    getAttempt,
    getQuiz,
    resetQuiz,
    submitQuiz,
  }
}
