<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import authImage from '@/assets/images/learning-dashboard.svg'

const router = useRouter()
const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  goal: 'ក្លាយជាអ្នកអភិវឌ្ឍន៍ Frontend',
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  name: '',
  email: '',
  goal: '',
  password: '',
  confirmPassword: '',
})
const submitting = ref(false)

const learningGoals = [
  'ក្លាយជាអ្នកអភិវឌ្ឍន៍ Frontend',
  'ពង្រឹងជំនាញ Backend',
  'បង្កើត portfolio project',
  'រៀន Data និង AI',
]

function clearErrors() {
  errors.name = ''
  errors.email = ''
  errors.goal = ''
  errors.password = ''
  errors.confirmPassword = ''
}

function validateRegister() {
  clearErrors()

  if (form.name.trim().length < 2) {
    errors.name = 'សូមបញ្ចូលឈ្មោះយ៉ាងហោចណាស់ 2 តួអក្សរ។'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'សូមបញ្ចូលអ៊ីមែលឲ្យបានត្រឹមត្រូវ។'
  }

  if (!form.goal) {
    errors.goal = 'សូមជ្រើសរើសគោលដៅសិក្សា។'
  }

  if (form.password.length < 8) {
    errors.password = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 8 តួអក្សរ។'
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'ពាក្យសម្ងាត់ទាំងពីរមិនដូចគ្នា។'
  }

  return !errors.name && !errors.email && !errors.goal && !errors.password && !errors.confirmPassword
}

async function submitRegister() {
  if (!validateRegister()) return

  submitting.value = true
  const result = await register(form)
  submitting.value = false

  if (!result.ok) {
    errors.email = result.message
    return
  }

  router.push('/courses')
}
</script>

<template>
  <section class="auth-page auth-page--register">
    <div class="container">
      <div class="auth-layout auth-layout--reverse" data-aos="fade-up">
        <aside class="auth-visual-panel">
          <div class="auth-brand-mini">
            <span>SL</span>
            <div>
              <strong>SmartLearn</strong>
              <small>ចាប់ផ្តើមរៀនថ្ងៃនេះ</small>
            </div>
          </div>

          <div class="auth-visual-copy">
            <span class="section-kicker text-white">ចុះឈ្មោះដោយឥតគិតថ្លៃ</span>
            <h1>បង្កើតគណនី ហើយរៀបចំផែនការរៀនផ្ទាល់ខ្លួន</h1>
            <p>
              SmartLearn ជួយអ្នកជ្រើសវគ្គសិក្សា តាមដានមេរៀន សន្សំពិន្ទុ Quiz និងរក្សាប្រវត្តិរៀនក្នុង browser របស់អ្នក។
            </p>
          </div>

          <div class="auth-preview-card auth-preview-card--tilt">
            <img :src="authImage" alt="SmartLearn learning dashboard preview" />
          </div>

          <div class="auth-check-list">
            <span><i class="bi bi-check2-circle"></i> Dashboard ផ្ទាល់ខ្លួន</span>
            <span><i class="bi bi-check2-circle"></i> វគ្គសិក្សាដែលបានចូលរៀន</span>
            <span><i class="bi bi-check2-circle"></i> Certificate បន្ទាប់ពីបញ្ចប់</span>
          </div>
        </aside>

        <div class="auth-form-panel">
          <div class="auth-form-header">
            <span class="section-kicker">បង្កើតគណនី</span>
            <h2>ចាប់ផ្តើមរៀនជាមួយ SmartLearn</h2>
            <p>បំពេញព័ត៌មានខ្លីៗ ដើម្បីបើក student profile និងរក្សាវឌ្ឍនភាពរៀនរបស់អ្នក។</p>
          </div>

          <form class="auth-form" @submit.prevent="submitRegister">
            <div>
              <label class="form-label" for="register-name">ឈ្មោះពេញ</label>
              <div class="input-group auth-input-group">
                <span class="input-group-text"><i class="bi bi-person"></i></span>
                <input
                  id="register-name"
                  v-model="form.name"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="ឈ្មោះរបស់អ្នក"
                  autocomplete="name"
                  required
                />
              </div>
              <p v-if="errors.name" class="auth-field-error">{{ errors.name }}</p>
            </div>

            <div>
              <label class="form-label" for="register-email">អ៊ីមែល</label>
              <div class="input-group auth-input-group">
                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                <input
                  id="register-email"
                  v-model="form.email"
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  required
                />
              </div>
              <p v-if="errors.email" class="auth-field-error">{{ errors.email }}</p>
            </div>

            <div>
              <label class="form-label" for="register-goal">គោលដៅសិក្សា</label>
              <div class="input-group auth-input-group">
                <span class="input-group-text"><i class="bi bi-bullseye"></i></span>
                <select id="register-goal" v-model="form.goal" class="form-select form-select-lg">
                  <option v-for="goal in learningGoals" :key="goal">{{ goal }}</option>
                </select>
              </div>
              <p v-if="errors.goal" class="auth-field-error">{{ errors.goal }}</p>
            </div>

            <div>
              <label class="form-label" for="register-password">ពាក្យសម្ងាត់</label>
              <div class="input-group auth-input-group">
                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                <input
                  id="register-password"
                  v-model="form.password"
                  class="form-control form-control-lg"
                  type="password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                />
              </div>
              <p v-if="errors.password" class="auth-field-error">{{ errors.password }}</p>
            </div>

            <div>
              <label class="form-label" for="register-confirm-password">បញ្ជាក់ពាក្យសម្ងាត់</label>
              <div class="input-group auth-input-group">
                <span class="input-group-text"><i class="bi bi-shield-lock"></i></span>
                <input
                  id="register-confirm-password"
                  v-model="form.confirmPassword"
                  class="form-control form-control-lg"
                  type="password"
                  autocomplete="new-password"
                  minlength="8"
                  required
                />
              </div>
              <p v-if="errors.confirmPassword" class="auth-field-error">{{ errors.confirmPassword }}</p>
            </div>

            <button class="btn btn-primary btn-lg auth-submit" type="submit" :disabled="submitting">
              <i class="bi bi-person-plus"></i>
              {{ submitting ? 'កំពុងបង្កើតគណនី...' : 'ចុះឈ្មោះ' }}
            </button>
          </form>

          <div class="auth-trust-row auth-trust-row--compact">
            <span><i class="bi bi-browser-chrome"></i> រក្សាទុកក្នុង browser</span>
            <span><i class="bi bi-stars"></i> Demo platform</span>
          </div>

          <p class="auth-footer-link">
            មានគណនីរួចហើយ?
            <RouterLink to="/login">ចូលគណនី</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
