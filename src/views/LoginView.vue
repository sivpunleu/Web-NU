<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import authImage from '@/assets/images/learning-dashboard.svg'

const route = useRoute()
const router = useRouter()
const { login } = useAuth()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})
const submitting = ref(false)
const showPassword = ref(false)
const canSubmit = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
  form.password.length >= 6,
)

const quickLogins = [
  {
    label: 'សិស្ស Demo',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    password: 'password',
    role: 'Student',
    icon: 'bi-person-check',
  },
  {
    label: 'Admin',
    name: 'Admin SmartLearn',
    email: 'admin@smartlearn.kh',
    password: 'admin123',
    role: 'Admin',
    icon: 'bi-shield-lock',
  },
]

const loginAccountName = computed(() => {
  const demoAccount = quickLogins.find(
    (account) => account.email === form.email.trim().toLowerCase(),
  )
  return demoAccount?.name || form.email.split('@')[0] || 'Smart Learner'
})

const loginInitials = computed(() => {
  return loginAccountName.value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
})

const loginRoleLabel = computed(() =>
  form.email.trim().toLowerCase() === 'admin@smartlearn.kh' ? 'Admin Account' : 'Student Account',
)
const selectedDemoEmail = computed(() =>
  quickLogins.some((account) => account.email === form.email.trim().toLowerCase())
    ? form.email.trim().toLowerCase()
    : '',
)

function applyDemo(account) {
  form.email = account.email
  form.password = account.password
  clearErrors()
}

function clearErrors() {
  errors.email = ''
  errors.password = ''
}

function validateLogin() {
  clearErrors()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'សូមបញ្ចូលអ៊ីមែលឲ្យបានត្រឹមត្រូវ។'
  }

  if (form.password.length < 6) {
    errors.password = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ។'
  }

  return !errors.email && !errors.password
}

function safeRedirect(value, fallback) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : fallback
}

async function submitLogin() {
  if (submitting.value || !validateLogin()) return

  submitting.value = true
  const result = await login(form)
  submitting.value = false

  if (!result.ok) {
    errors.password = result.message
    return
  }

  const fallback = result.user.role === 'admin' ? '/admin' : '/dashboard'
  router.push(safeRedirect(route.query.redirect, fallback))
}
</script>

<template>
  <section class="auth-page auth-page--login">
    <div class="auth-login-orb auth-login-orb--one"></div>
    <div class="auth-login-orb auth-login-orb--two"></div>
    <div class="container">
      <div class="auth-layout auth-login-layout" data-aos="fade-up">
        <aside class="auth-visual-panel">
          <div class="auth-visual-glow"></div>
          <div class="auth-brand-mini">
            <span>SL</span>
            <div>
              <strong>SmartLearn</strong>
              <small>Khmer E-Learning</small>
            </div>
          </div>

          <div class="auth-visual-copy">
            <span class="auth-visual-kicker">
              <i class="bi bi-stars"></i>
              ចូលរៀនបន្ត
            </span>
            <h1>បន្តអភិវឌ្ឍជំនាញរបស់អ្នក រាល់ថ្ងៃ</h1>
            <p>
              ចូលគណនីដើម្បីបន្តមេរៀន តាមដានវឌ្ឍនភាព ធ្វើ Quiz និងទទួលវិញ្ញាបនបត្រ។
            </p>
          </div>

          <div class="auth-preview-card">
            <img :src="authImage" alt="SmartLearn dashboard preview" />
            <span class="auth-preview-status">
              <i class="bi bi-play-fill"></i>
              បន្តពីកន្លែងដែលអ្នកបានឈប់
            </span>
          </div>

          <div class="auth-stat-grid">
            <div class="auth-stat">
              <strong>12+</strong>
              <span>វគ្គសិក្សា</span>
            </div>
            <div class="auth-stat">
              <strong>85%</strong>
              <span>រៀនតាមដានបាន</span>
            </div>
            <div class="auth-stat">
              <strong>24/7</strong>
              <span>រៀនបានគ្រប់ពេល</span>
            </div>
          </div>
        </aside>

        <div class="auth-form-panel">
          <div class="auth-form-shell">
            <div class="auth-form-header">
              <span class="auth-form-kicker">
                <i class="bi bi-shield-check"></i>
                Secure sign in
              </span>
              <h2>សូមស្វាគមន៍មកវិញ</h2>
              <p>ជ្រើសគណនីសាកល្បង ឬបញ្ចូលគណនីរបស់អ្នកដើម្បីបន្ត។</p>
            </div>

            <div class="auth-demo-section">
              <div class="auth-demo-heading">
                <span>ចូលរហ័សជាមួយ Demo</span>
                <small>មិនចាំបាច់វាយបញ្ចូល</small>
              </div>
              <div class="auth-demo-grid" aria-label="Demo accounts">
                <button
                  v-for="account in quickLogins"
                  :key="account.email"
                  class="auth-demo-card"
                  :class="{ 'auth-demo-card--active': selectedDemoEmail === account.email }"
                  type="button"
                  @click="applyDemo(account)"
                >
                  <i class="bi" :class="account.icon"></i>
                  <span>
                    <strong>{{ account.label }}</strong>
                    <small>{{ account.email }}</small>
                  </span>
                  <i
                    class="bi auth-demo-check"
                    :class="selectedDemoEmail === account.email ? 'bi-check-circle-fill' : 'bi-arrow-up-right'"
                  ></i>
                </button>
              </div>
            </div>

            <div class="auth-divider"><span>ឬចូលដោយគណនីរបស់អ្នក</span></div>

            <form class="auth-form" @submit.prevent="submitLogin">
              <div>
                <label class="form-label" for="login-email">អ៊ីមែល</label>
                <div class="input-group auth-input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input
                    id="login-email"
                    v-model.trim="form.email"
                    class="form-control form-control-lg"
                    type="email"
                    autocomplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <p v-if="errors.email" class="auth-field-error">{{ errors.email }}</p>
              </div>

              <div>
                <div class="d-flex align-items-center justify-content-between gap-2">
                  <label class="form-label" for="login-password">ពាក្យសម្ងាត់</label>
                  <RouterLink class="auth-small-link" to="/forgot-password">ភ្លេចពាក្យសម្ងាត់?</RouterLink>
                </div>
                <div class="input-group auth-input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input
                    id="login-password"
                    v-model="form.password"
                    class="form-control form-control-lg"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    placeholder="បញ្ចូលពាក្យសម្ងាត់"
                    minlength="6"
                    required
                  />
                  <button
                    class="btn auth-password-toggle"
                    type="button"
                    :aria-label="showPassword ? 'លាក់ពាក្យសម្ងាត់' : 'បង្ហាញពាក្យសម្ងាត់'"
                    @click="showPassword = !showPassword"
                  >
                    <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
                <p v-if="errors.password" class="auth-field-error">{{ errors.password }}</p>
              </div>

              <div v-if="form.email" class="auth-account-preview" aria-live="polite">
                <span class="auth-account-avatar">{{ loginInitials }}</span>
                <span>
                  <small>កំពុងចូលជា</small>
                  <strong>{{ loginAccountName }}</strong>
                  <small>{{ loginRoleLabel }} · {{ form.email }}</small>
                </span>
                <i class="bi bi-patch-check-fill auth-account-verified"></i>
              </div>

              <button
                class="btn btn-primary btn-lg auth-submit"
                type="submit"
                :disabled="submitting || !canSubmit"
              >
                <span>{{ submitting ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ចូលគណនី' }}</span>
                <i class="bi" :class="submitting ? 'bi-arrow-repeat auth-spin' : 'bi-arrow-right'"></i>
              </button>
            </form>

            <div class="auth-trust-row">
              <span><i class="bi bi-shield-lock"></i> ទិន្នន័យផ្ទាល់ខ្លួន</span>
              <span><i class="bi bi-lightning-charge"></i> ចូលប្រើភ្លាមៗ</span>
            </div>

            <p class="auth-footer-link">
              មិនទាន់មានគណនី?
              <RouterLink to="/register">បង្កើតគណនីថ្មី <i class="bi bi-arrow-up-right"></i></RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
