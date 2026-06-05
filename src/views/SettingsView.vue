<script setup>
import { reactive, ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { readScopedStorage, writeScopedStorage } from '@/utils/userStorage'

const STORAGE_KEY = 'smartlearn_settings'

const defaults = {
  language: 'km',
  theme: 'system',
  emailNotifications: true,
  courseReminders: true,
  publicProfile: false,
}

function readSettings() {
  return {
    ...defaults,
    ...readScopedStorage(STORAGE_KEY, {}),
  }
}

const settings = reactive(readSettings())
const saved = ref(false)

function saveSettings() {
  writeScopedStorage(STORAGE_KEY, settings)

  saved.value = true
  window.setTimeout(() => {
    saved.value = false
  }, 2400)
}

function resetSettings() {
  Object.assign(settings, defaults)
  saveSettings()
}
</script>

<template>
  <section class="settings-page py-5">
    <div class="container">
      <div class="row g-4 align-items-start">
        <div class="col-lg-3">
          <Sidebar />
        </div>

        <div class="col-lg-9">
          <div class="settings-hero" data-aos="fade-up">
            <span class="section-kicker text-white-50">Settings</span>
            <h1>កំណត់ប្រព័ន្ធ និង Preference</h1>
            <p>គ្រប់គ្រងរបៀបបង្ហាញ ភាសា និងការជូនដំណឹងសម្រាប់បទពិសោធន៍រៀនរបស់អ្នក។</p>
          </div>

          <form class="settings-grid" data-aos="fade-up" data-aos-delay="100" @submit.prevent="saveSettings">
            <article class="settings-card">
              <div class="settings-card__header">
                <i class="bi bi-translate"></i>
                <div>
                  <h2>ភាសា និង Theme</h2>
                  <p>កំណត់របៀបបង្ហាញមូលដ្ឋាន។</p>
                </div>
              </div>

              <label class="form-label" for="settings-language">ភាសា</label>
              <select id="settings-language" v-model="settings.language" class="form-select">
                <option value="km">ភាសាខ្មែរ</option>
                <option value="en">English</option>
              </select>

              <label class="form-label mt-3" for="settings-theme">Theme</label>
              <select id="settings-theme" v-model="settings.theme" class="form-select">
                <option value="system">តាមប្រព័ន្ធ</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </article>

            <article class="settings-card">
              <div class="settings-card__header">
                <i class="bi bi-bell"></i>
                <div>
                  <h2>ការជូនដំណឹង</h2>
                  <p>ជ្រើសរើសសារដែលអ្នកចង់ទទួល។</p>
                </div>
              </div>

              <label class="settings-switch">
                <span>
                  <strong>Email notifications</strong>
                  <small>ទទួលព័ត៌មានវគ្គថ្មី និងសកម្មភាពគណនី។</small>
                </span>
                <input v-model="settings.emailNotifications" type="checkbox" />
              </label>

              <label class="settings-switch">
                <span>
                  <strong>Course reminders</strong>
                  <small>រំលឹកបន្តមេរៀន និង quiz ដែលនៅសល់។</small>
                </span>
                <input v-model="settings.courseReminders" type="checkbox" />
              </label>
            </article>

            <article class="settings-card">
              <div class="settings-card__header">
                <i class="bi bi-person-lines-fill"></i>
                <div>
                  <h2>Profile</h2>
                  <p>គ្រប់គ្រងភាពឯកជននៃ profile។</p>
                </div>
              </div>

              <label class="settings-switch">
                <span>
                  <strong>Public profile</strong>
                  <small>អនុញ្ញាតឲ្យបង្ហាញ profile summary ក្នុង demo platform។</small>
                </span>
                <input v-model="settings.publicProfile" type="checkbox" />
              </label>
            </article>

            <div class="settings-actions">
              <button class="btn btn-primary" type="submit">
                <i class="bi bi-save me-2"></i>រក្សាទុក Settings
              </button>
              <button class="btn btn-outline-secondary" type="button" @click="resetSettings">
                <i class="bi bi-arrow-counterclockwise me-2"></i>Reset
              </button>
              <span v-if="saved" class="settings-save-alert" role="status">
                <i class="bi bi-check2-circle"></i>
                បានរក្សាទុក
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
