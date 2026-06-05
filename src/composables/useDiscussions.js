import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const STORAGE_KEY = 'smartlearn_discussions'

function readStorage() {
  if (typeof window === 'undefined') return {}

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function writeStorage(value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

const discussions = ref(readStorage())

function createId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

export function useDiscussions(courseId) {
  const { currentUser, isAdmin } = useAuth()
  const { addNotification } = useNotifications()

  const courseDiscussions = computed(() => discussions.value[courseId] ?? [])

  function persist(nextDiscussions) {
    discussions.value = {
      ...discussions.value,
      [courseId]: nextDiscussions,
    }
    writeStorage(discussions.value)
  }

  function addQuestion({ title, body, lessonTitle }) {
    if (!currentUser.value || !title.trim() || !body.trim()) return false

    const question = {
      id: createId(),
      title: title.trim(),
      body: body.trim(),
      lessonTitle: lessonTitle || '',
      authorId: currentUser.value.id,
      author: currentUser.value.name,
      createdAt: new Date().toISOString(),
      solved: false,
      replies: [],
    }

    persist([question, ...courseDiscussions.value])
    addNotification({
      title: 'បានបន្ថែមសំណួរ Q&A',
      message: 'សំណួររបស់អ្នកត្រូវបានបង្ហាញក្នុង Discussion។',
      type: 'info',
      to: `/courses/${courseId}`,
    })

    return true
  }

  function addReply(questionId, body) {
    if (!currentUser.value || !body.trim()) return false

    const nextDiscussions = courseDiscussions.value.map((question) => {
      if (question.id !== questionId) return question

      return {
        ...question,
        replies: [
          ...question.replies,
          {
            id: createId(),
            body: body.trim(),
            authorId: currentUser.value.id,
            author: currentUser.value.name,
            createdAt: new Date().toISOString(),
          },
        ],
      }
    })

    persist(nextDiscussions)
    return true
  }

  function toggleSolved(questionId) {
    const question = courseDiscussions.value.find((item) => item.id === questionId)
    if (!question || !canManageQuestion(question)) return false

    const nextDiscussions = courseDiscussions.value.map((question) =>
      question.id === questionId ? { ...question, solved: !question.solved } : question,
    )

    persist(nextDiscussions)
    return true
  }

  function canManageQuestion(question) {
    return Boolean(
      currentUser.value &&
      (isAdmin.value || question.authorId === currentUser.value.id),
    )
  }

  return {
    addQuestion,
    addReply,
    canManageQuestion,
    courseDiscussions,
    toggleSolved,
  }
}
