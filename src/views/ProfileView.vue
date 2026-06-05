<script setup>
import { computed, reactive, ref, watchEffect } from 'vue'
import ProgressChart from '@/components/ProgressChart.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useAuth } from '@/composables/useAuth'
import { useLearning } from '@/composables/useLearning'

const { currentUser, updateProfile } = useAuth()
const {
  enrolledCourses,
  favoriteCourses,
  getCompletedLessonCount,
  getCourseProgress,
  isCourseComplete,
} = useLearning()

const form = reactive({
  name: '',
  email: '',
  goal: '',
  level: '',
  bio: '',
  avatarUrl: '',
})

const saved = ref(false)
const avatarError = ref('')

const errors = reactive({
  name: '',
  email: '',
})

const learningGoals = [
  'ក្លាយជាអ្នកអភិវឌ្ឍន៍ Frontend',
  'ពង្រឹងជំនាញ Backend',
  'បង្កើត portfolio project',
  'រៀន Data និង AI',
]

const levels = ['Beginner', 'Intermediate', 'Advanced']

watchEffect(() => {
  form.name = currentUser.value?.name ?? ''
  form.email = currentUser.value?.email ?? ''
  form.goal = currentUser.value?.goal ?? learningGoals[0]
  form.level = currentUser.value?.level ?? 'Intermediate'
  form.avatarUrl = currentUser.value?.avatarUrl ?? ''
  form.bio =
    currentUser.value?.bio ??
    'ខ្ញុំកំពុងរៀនជំនាញឌីជីថល ដើម្បីបង្កើត project ពិត និងពង្រឹង portfolio របស់ខ្ញុំ។'
})

const userInitials = computed(() => {
  const name = currentUser.value?.name?.trim() || 'Smart Learner'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
})

const roleLabel = computed(() => (currentUser.value?.role === 'admin' ? 'អ្នកគ្រប់គ្រង' : 'សិស្ស'))
const avatarPreview = computed(() => form.avatarUrl)

const completedLessons = computed(() =>
  enrolledCourses.value.reduce((total, course) => total + getCompletedLessonCount(course), 0),
)

const averageProgress = computed(() => {
  if (!enrolledCourses.value.length) return 0
  const total = enrolledCourses.value.reduce((sum, course) => sum + getCourseProgress(course), 0)
  return Math.round(total / enrolledCourses.value.length)
})

const completedCourses = computed(() => enrolledCourses.value.filter((course) => isCourseComplete(course)).length)
const recentCourses = computed(() => enrolledCourses.value.slice(0, 3))

const profileStats = computed(() => [
  {
    icon: 'bi-collection-play',
    label: 'វគ្គកំពុងរៀន',
    value: enrolledCourses.value.length,
    color: 'blue',
  },
  {
    icon: 'bi-check2-circle',
    label: 'មេរៀនបានបញ្ចប់',
    value: completedLessons.value,
    color: 'green',
  },
  {
    icon: 'bi-bar-chart-line',
    label: 'វឌ្ឍនភាពមធ្យម',
    value: `${averageProgress.value}%`,
    color: 'amber',
  },
  {
    icon: 'bi-award',
    label: 'វគ្គបានបញ្ចប់',
    value: completedCourses.value,
    color: 'violet',
  },
])

function selectGoal(goal) {
  form.goal = goal
}

function handleAvatarUpload(event) {
  const [file] = event.target.files ?? []
  if (!file) return

  avatarError.value = ''

  if (!file.type.startsWith('image/')) {
    avatarError.value = 'សូមជ្រើសរើសឯកសាររូបភាពតែប៉ុណ្ណោះ។'
    event.target.value = ''
    return
  }

  if (file.size > 1.5 * 1024 * 1024) {
    avatarError.value = 'សូមជ្រើសរើសរូបភាពតូចជាង 1.5MB។'
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    form.avatarUrl = String(reader.result || '')
  }
  reader.onerror = () => {
    avatarError.value = 'មិនអាចអានរូបភាពនេះបានទេ។'
  }
  reader.readAsDataURL(file)
}

function clearAvatar() {
  form.avatarUrl = ''
  avatarError.value = ''
}

function clearErrors() {
  errors.name = ''
  errors.email = ''
}

function validateProfile() {
  clearErrors()

  if (form.name.trim().length < 2) {
    errors.name = 'សូមបញ្ចូលឈ្មោះយ៉ាងហោចណាស់ 2 តួអក្សរ។'
  }

  return !errors.name
}

function saveProfile() {
  if (!validateProfile()) return

  updateProfile({ ...form })
  saved.value = true
  window.setTimeout(() => {
    saved.value = false
  }, 2600)
}
</script>

<template>
  <section class="profile-page py-5">
    <div class="container">
      <div class="row g-4 align-items-start">
        <div class="col-lg-3">
          <Sidebar />
        </div>

        <div class="col-lg-9">
          <div class="profile-hero" data-aos="fade-up">
            <div class="profile-hero__main">
              <div class="profile-avatar">
                <img v-if="avatarPreview" :src="avatarPreview" :alt="`${form.name || 'Smart Learner'} profile`" />
                <span v-else>{{ userInitials }}</span>
              </div>
              <div>
                <span class="section-kicker">ប្រវត្តិរូប</span>
                <h1>សួស្តី {{ currentUser?.name || 'អ្នករៀន' }}</h1>
                <p>
                  គ្រប់គ្រងព័ត៌មានគណនី គោលដៅសិក្សា និងមើលសង្ខេបវឌ្ឍនភាពរបស់អ្នកនៅកន្លែងតែមួយ។
                </p>
              </div>
            </div>

            <div class="profile-hero__actions">
              <RouterLink class="btn btn-primary" to="/my-courses">
                <i class="bi bi-play-circle me-2"></i>វគ្គរបស់ខ្ញុំ
              </RouterLink>
              <RouterLink class="btn btn-outline-primary" to="/courses">
                <i class="bi bi-plus-circle me-2"></i>រកវគ្គថ្មី
              </RouterLink>
            </div>

            <div class="profile-identity-row">
              <span><i class="bi bi-person-badge"></i>{{ roleLabel }}</span>
              <span><i class="bi bi-envelope"></i>{{ currentUser?.email || 'student@smartlearn.kh' }}</span>
              <span><i class="bi bi-bullseye"></i>{{ form.goal }}</span>
            </div>
          </div>

          <div class="profile-overview-grid" data-aos="fade-up" data-aos-delay="80">
            <article
              v-for="stat in profileStats"
              :key="stat.label"
              class="profile-stat-card"
              :class="`profile-stat-card--${stat.color}`"
            >
              <i class="bi" :class="stat.icon"></i>
              <span>{{ stat.label }}</span>
              <strong>{{ stat.value }}</strong>
            </article>
          </div>

          <div class="profile-main-grid">
            <form class="profile-card profile-form-card" data-aos="fade-up" data-aos-delay="120" @submit.prevent="saveProfile">
              <div class="profile-card__header">
                <div>
                  <span class="section-kicker">កែព័ត៌មាន</span>
                  <h2>ព័ត៌មានផ្ទាល់ខ្លួន</h2>
                </div>
                <span class="profile-status-pill">
                  <i class="bi bi-shield-check"></i> Active
                </span>
              </div>

              <div class="profile-photo-uploader">
                <div class="profile-photo-preview">
                  <img v-if="avatarPreview" :src="avatarPreview" :alt="`${form.name || 'Smart Learner'} profile preview`" />
                  <span v-else>{{ userInitials }}</span>
                </div>

                <div class="profile-photo-copy">
                  <label class="form-label" for="profile-avatar">រូបភាព Profile</label>
                  <p>ប្រើ JPG, PNG ឬ WebP តូចជាង 1.5MB។</p>
                  <div class="profile-photo-actions">
                    <input
                      id="profile-avatar"
                      class="profile-photo-input"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      @change="handleAvatarUpload"
                    />
                    <label class="btn btn-outline-primary" for="profile-avatar">
                      <i class="bi bi-image me-2"></i>ជ្រើសរូប
                    </label>
                    <button class="btn btn-outline-danger" type="button" :disabled="!avatarPreview" @click="clearAvatar">
                      <i class="bi bi-trash me-2"></i>ដករូប
                    </button>
                  </div>
                  <small v-if="avatarError" class="profile-avatar-error">{{ avatarError }}</small>
                </div>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="profile-name">ឈ្មោះពេញ</label>
                  <div class="input-group profile-input">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <input
                      id="profile-name"
                      v-model.trim="form.name"
                      class="form-control"
                      type="text"
                      autocomplete="name"
                      required
                    />
                  </div>
                  <p v-if="errors.name" class="profile-field-error">{{ errors.name }}</p>
                </div>

                <div class="col-md-6">
                  <label class="form-label" for="profile-email">អ៊ីមែល</label>
                  <div class="input-group profile-input">
                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                    <input
                      id="profile-email"
                      v-model.trim="form.email"
                      class="form-control"
                      type="email"
                      autocomplete="email"
                      readonly
                      required
                    />
                  </div>
                  <p v-if="errors.email" class="profile-field-error">{{ errors.email }}</p>
                </div>

                <div class="col-md-6">
                  <label class="form-label" for="profile-level">កម្រិតជំនាញ</label>
                  <div class="input-group profile-input">
                    <span class="input-group-text"><i class="bi bi-graph-up-arrow"></i></span>
                    <select id="profile-level" v-model="form.level" class="form-select">
                      <option v-for="level in levels" :key="level">{{ level }}</option>
                    </select>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label" for="profile-goal">គោលដៅសិក្សា</label>
                  <div class="input-group profile-input">
                    <span class="input-group-text"><i class="bi bi-bullseye"></i></span>
                    <select id="profile-goal" v-model="form.goal" class="form-select">
                      <option v-for="goal in learningGoals" :key="goal">{{ goal }}</option>
                    </select>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label" for="profile-bio">អំពីខ្ញុំ</label>
                  <textarea id="profile-bio" v-model="form.bio" class="form-control profile-bio" rows="4"></textarea>
                </div>
              </div>

              <div v-if="saved" class="profile-save-alert">
                <i class="bi bi-check2-circle"></i>
                បានរក្សាទុកព័ត៌មានរបស់អ្នករួចហើយ។
              </div>

              <div class="profile-form-actions">
                <button class="btn btn-primary" type="submit">
                  <i class="bi bi-save me-2"></i>រក្សាទុក
                </button>
                <RouterLink class="btn btn-outline-primary" to="/dashboard">
                  <i class="bi bi-speedometer2 me-2"></i>ទៅ Dashboard
                </RouterLink>
                <RouterLink class="btn btn-outline-secondary" to="/settings">
                  <i class="bi bi-gear me-2"></i>Settings
                </RouterLink>
              </div>
            </form>

            <div class="profile-side-stack">
              <ProgressChart
                :value="averageProgress"
                label="វឌ្ឍនភាពរៀន"
                caption="មធ្យមភាគពីវគ្គដែលបានចុះឈ្មោះ"
                icon="bi-pie-chart"
                tone="violet"
                data-aos="fade-up"
                data-aos-delay="140"
              />

              <article class="profile-card" data-aos="fade-up" data-aos-delay="160">
                <div class="profile-card__header">
                  <div>
                    <span class="section-kicker">គោលដៅ</span>
                    <h2>ផ្លូវរៀនរបស់អ្នក</h2>
                  </div>
                </div>

                <div class="profile-goal-list">
                  <button
                    v-for="goal in learningGoals"
                    :key="goal"
                    class="profile-goal-chip"
                    :class="{ active: form.goal === goal }"
                    type="button"
                    @click="selectGoal(goal)"
                  >
                    {{ goal }}
                  </button>
                </div>
              </article>

              <article class="profile-card" data-aos="fade-up" data-aos-delay="200">
                <div class="profile-card__header">
                  <div>
                    <span class="section-kicker">សកម្មភាព</span>
                    <h2>វគ្គថ្មីៗ</h2>
                  </div>
                  <RouterLink class="profile-small-link" to="/my-courses">មើលទាំងអស់</RouterLink>
                </div>

                <div v-if="recentCourses.length" class="profile-course-list">
                  <RouterLink
                    v-for="course in recentCourses"
                    :key="course.id"
                    class="profile-course-mini"
                    :to="`/courses/${course.id}`"
                  >
                    <img :src="course.image" :alt="course.title" />
                    <div>
                      <strong>{{ course.title }}</strong>
                      <span>{{ getCourseProgress(course) }}% complete</span>
                    </div>
                  </RouterLink>
                </div>

                <p v-else class="profile-empty-text mb-0">មិនទាន់មានវគ្គសិក្សា។</p>
              </article>

              <article class="profile-card" data-aos="fade-up" data-aos-delay="240">
                <div class="profile-card__header">
                  <div>
                    <span class="section-kicker">គណនី</span>
                    <h2>ស្ថានភាព</h2>
                  </div>
                </div>

                <div class="profile-settings-list">
                  <div class="profile-setting">
                    <i class="bi bi-heart"></i>
                    <span>វគ្គបានរក្សាទុក</span>
                    <strong>{{ favoriteCourses.length }}</strong>
                  </div>
                  <div class="profile-setting">
                    <i class="bi bi-person-check"></i>
                    <span>ប្រភេទគណនី</span>
                    <strong>{{ roleLabel }}</strong>
                  </div>
                  <div class="profile-setting">
                    <i class="bi bi-stars"></i>
                    <span>កម្រិតជំនាញ</span>
                    <strong>{{ form.level }}</strong>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
