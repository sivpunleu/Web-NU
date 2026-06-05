<script setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDiscussions } from '@/composables/useDiscussions'

const props = defineProps({
  courseId: {
    type: String,
    required: true,
  },
  lessonTitle: {
    type: String,
    default: '',
  },
})

const route = useRoute()
const { isAuthenticated } = useAuth()
const { addQuestion, addReply, canManageQuestion, courseDiscussions, toggleSolved } =
  useDiscussions(props.courseId)

const questionForm = reactive({
  title: '',
  body: '',
})

const replyForms = reactive({})

function submitQuestion() {
  const added = addQuestion({
    ...questionForm,
    lessonTitle: props.lessonTitle,
  })
  if (!added) return

  questionForm.title = ''
  questionForm.body = ''
}

function submitReply(questionId) {
  const added = addReply(questionId, replyForms[questionId] ?? '')
  if (!added) return
  replyForms[questionId] = ''
}
</script>

<template>
  <section class="discussion-panel" data-aos="fade-up">
    <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
      <div>
        <span class="section-kicker">Discussion / Q&A</span>
        <h2 class="h3 fw-bold mt-2 mb-0">សំណួរ និងចម្លើយ</h2>
      </div>
      <span class="badge text-bg-primary align-self-md-end">{{ courseDiscussions.length }} សំណួរ</span>
    </div>

    <form v-if="isAuthenticated" class="discussion-form mb-4" @submit.prevent="submitQuestion">
      <div class="row g-3">
        <div class="col-md-5">
          <label class="form-label">
            ចំណងជើងសំណួរ
            <input v-model="questionForm.title" class="form-control" type="text" placeholder="សួរអំពីមេរៀន..." />
          </label>
        </div>
        <div class="col-md-7">
          <label class="form-label">
            ព័ត៌មានលម្អិត
            <input v-model="questionForm.body" class="form-control" type="text" placeholder="ពន្យល់អ្វីដែលអ្នកមិនទាន់យល់" />
          </label>
        </div>
      </div>
      <button class="btn btn-primary mt-3" type="submit">បញ្ចូលសំណួរ</button>
    </form>
    <div v-else class="discussion-form mb-4">
      <p class="text-secondary">សូមចូលគណនី ដើម្បីសួរសំណួរ ឬឆ្លើយតបក្នុង Discussion។</p>
      <RouterLink
        class="btn btn-primary"
        :to="{ path: '/login', query: { redirect: route.fullPath } }"
      >
        ចូលគណនី
      </RouterLink>
    </div>

    <div v-if="courseDiscussions.length" class="vstack gap-3">
      <article v-for="question in courseDiscussions" :key="question.id" class="discussion-item">
        <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
          <div>
            <h3 class="h5 fw-bold mb-1">{{ question.title }}</h3>
            <p class="text-secondary mb-2">{{ question.body }}</p>
            <p class="small text-secondary mb-0">
              {{ question.author }}
              <span v-if="question.lessonTitle">• {{ question.lessonTitle }}</span>
              • {{ new Date(question.createdAt).toLocaleString() }}
            </p>
          </div>
          <button
            v-if="canManageQuestion(question)"
            class="btn btn-sm"
            :class="question.solved ? 'btn-success' : 'btn-outline-secondary'"
            type="button"
            @click="toggleSolved(question.id)"
          >
            {{ question.solved ? 'Solved' : 'Mark solved' }}
          </button>
        </div>

        <div v-if="question.replies.length" class="discussion-replies">
          <div v-for="reply in question.replies" :key="reply.id" class="discussion-reply">
            <p class="mb-1">{{ reply.body }}</p>
            <span>{{ reply.author }} • {{ new Date(reply.createdAt).toLocaleString() }}</span>
          </div>
        </div>

        <form v-if="isAuthenticated" class="discussion-reply-form" @submit.prevent="submitReply(question.id)">
          <input
            v-model="replyForms[question.id]"
            class="form-control"
            type="text"
            placeholder="ឆ្លើយតប..."
          />
          <button class="btn btn-outline-primary" type="submit">Reply</button>
        </form>
      </article>
    </div>

    <div v-else class="discussion-empty">
      <i class="bi bi-chat-dots"></i>
      <span>មិនទាន់មានសំណួរ។ ចាប់ផ្តើមសួរមុនគេបាន។</span>
    </div>
  </section>
</template>
