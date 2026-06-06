<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import Sidebar from '@/components/Sidebar.vue'
import { useNotifications } from '@/composables/useNotifications'
import { useSettings } from '@/composables/useSettings'
import {
  downloadSmartLearnBackup,
  parseSmartLearnBackup,
  restoreSmartLearnBackup,
} from '@/utils/dataBackup'

const { settings, saveSettings: persistSettings, resetSettings: resetStoredSettings } = useSettings()
const { addNotification } = useNotifications()
const saved = ref(false)
const importInput = ref(null)

function saveSettings() {
  persistSettings()

  saved.value = true
  window.setTimeout(() => {
    saved.value = false
  }, 2400)
}

async function resetSettings() {
  const result = await Swal.fire({
    title: 'Reset Settings?',
    text: 'Theme និង preferences នឹងត្រឡប់ទៅតម្លៃដើម។',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Reset',
    cancelButtonText: 'បោះបង់',
    confirmButtonColor: '#2563eb',
  })

  if (!result.isConfirmed) return
  resetStoredSettings()
  saved.value = true
}

function exportData() {
  const count = downloadSmartLearnBackup()
  addNotification({
    title: 'បាន Export ទិន្នន័យ',
    message: `បានរក្សាទុក ${count} data groups ជា JSON file។`,
    type: 'success',
    to: '/settings',
  })
}

function openImportPicker() {
  importInput.value?.click()
}

async function importData(event) {
  const [file] = event.target.files ?? []
  event.target.value = ''
  if (!file) return

  try {
    const backup = parseSmartLearnBackup(await file.text())
    const count = Object.keys(backup.entries).length
    const result = await Swal.fire({
      title: 'Restore Backup?',
      text: `ទិន្នន័យ ${count} groups នឹងសរសេរជាន់លើទិន្នន័យដែលមានឈ្មោះដូចគ្នា។`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Restore',
      cancelButtonText: 'បោះបង់',
      confirmButtonColor: '#2563eb',
    })

    if (!result.isConfirmed) return
    restoreSmartLearnBackup(backup)

    await Swal.fire({
      title: 'Restore បានជោគជ័យ',
      text: 'ទំព័រនឹង refresh ដើម្បីប្រើទិន្នន័យដែលបាន restore។',
      icon: 'success',
      confirmButtonColor: '#2563eb',
    })
    window.location.reload()
  } catch {
    Swal.fire({
      title: 'Backup មិនត្រឹមត្រូវ',
      text: 'សូមជ្រើសរើស JSON backup ដែលបាន export ពី SmartLearn។',
      icon: 'error',
      confirmButtonColor: '#2563eb',
    })
  }
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

            <article class="settings-card settings-card--data">
              <div class="settings-card__header">
                <i class="bi bi-database-check"></i>
                <div>
                  <h2>Data Backup</h2>
                  <p>រក្សាទុក ឬ restore ទិន្នន័យ SmartLearn ក្នុង browser ជា JSON។</p>
                </div>
              </div>

              <div class="settings-data-actions">
                <button class="btn btn-outline-primary" type="button" @click="exportData">
                  <i class="bi bi-download me-2"></i>Export JSON
                </button>
                <button class="btn btn-outline-secondary" type="button" @click="openImportPicker">
                  <i class="bi bi-upload me-2"></i>Import JSON
                </button>
                <input
                  ref="importInput"
                  class="visually-hidden"
                  type="file"
                  accept="application/json,.json"
                  @change="importData"
                />
              </div>
              <p class="settings-data-note mb-0">
                <i class="bi bi-info-circle"></i>
                Backup រួមមាន course, progress, quiz និង preferences ប៉ុន្តែមិនរួមបញ្ចូល active login session ទេ។
              </p>
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
