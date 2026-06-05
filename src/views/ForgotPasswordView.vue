<script setup>
import { reactive, ref } from 'vue'
import authImage from '@/assets/images/learning-dashboard.svg'

const form = reactive({
  email: '',
})

const error = ref('')
const submitted = ref(false)

function submitReset() {
  error.value = ''
  submitted.value = false

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    error.value = 'សូមបញ្ចូលអ៊ីមែលឲ្យបានត្រឹមត្រូវ។'
    return
  }

  submitted.value = true
}
</script>

<template>
  <section class="auth-page auth-page--forgot">
    <div class="container">
      <div class="auth-layout" data-aos="fade-up">
        <aside class="auth-visual-panel">
          <div class="auth-brand-mini">
            <span>SL</span>
            <div>
              <strong>SmartLearn</strong>
              <small>Account recovery</small>
            </div>
          </div>

          <div class="auth-visual-copy">
            <span class="section-kicker text-white">សុវត្ថិភាពគណនី</span>
            <h1>ស្នើ reset password សម្រាប់គណនីរបស់អ្នក</h1>
            <p>
              បញ្ចូលអ៊ីមែលដែលអ្នកប្រើចូលគណនី។ នៅក្នុង demo platform នេះ យើងនឹងបង្ហាញសារបញ្ជាក់ជំនួសការផ្ញើអ៊ីមែលពិត។
            </p>
          </div>

          <div class="auth-preview-card auth-preview-card--tilt">
            <img :src="authImage" alt="SmartLearn account recovery preview" />
          </div>
        </aside>

        <div class="auth-form-panel">
          <div class="auth-form-header">
            <span class="section-kicker">ភ្លេចពាក្យសម្ងាត់</span>
            <h2>ស្នើ reset link</h2>
            <p>ប្រសិនបើអ៊ីមែលនេះមានក្នុងប្រព័ន្ធ អ្នកនឹងទទួលបាន link សម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី។</p>
          </div>

          <form class="auth-form" @submit.prevent="submitReset">
            <div>
              <label class="form-label" for="forgot-email">អ៊ីមែល</label>
              <div class="input-group auth-input-group">
                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                <input
                  id="forgot-email"
                  v-model.trim="form.email"
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                  required
                />
              </div>
              <p v-if="error" class="auth-field-error">{{ error }}</p>
            </div>

            <div v-if="submitted" class="auth-success-panel" role="status">
              <i class="bi bi-check2-circle"></i>
              <div>
                <strong>បានទទួលសំណើរបស់អ្នក</strong>
                <span>Demo reset link ត្រូវបានរៀបចំសម្រាប់ {{ form.email }}។</span>
              </div>
            </div>

            <button class="btn btn-primary btn-lg auth-submit" type="submit">
              <i class="bi bi-send"></i>
              ផ្ញើ reset link
            </button>
          </form>

          <p class="auth-footer-link">
            ចាំពាក្យសម្ងាត់វិញ?
            <RouterLink to="/login">ត្រឡប់ទៅចូលគណនី</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
