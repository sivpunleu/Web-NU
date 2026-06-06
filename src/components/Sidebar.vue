<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { isAdmin } = useAuth()
const route = useRoute()
const router = useRouter()

function navigateFromMobile(event) {
  const destination = event.target.value

  if (destination && destination !== route.path) {
    router.push(destination)
  }
}
</script>

<template>
  <aside class="student-sidebar">
    <div class="sidebar-mobile-nav">
      <span class="sidebar-mobile-nav__icon" aria-hidden="true">
        <i class="bi bi-grid"></i>
      </span>
      <label class="visually-hidden" for="student-mobile-navigation">ជ្រើសរើសទំព័រ</label>
      <select
        id="student-mobile-navigation"
        class="form-select"
        :value="route.path"
        aria-label="ជ្រើសរើសទំព័រ"
        @change="navigateFromMobile"
      >
        <option value="/dashboard">ទិដ្ឋភាពរួម</option>
        <option value="/courses">វគ្គសិក្សា</option>
        <option value="/my-courses">វគ្គរបស់ខ្ញុំ</option>
        <option value="/notifications">ការជូនដំណឹង</option>
        <option value="/profile">ប្រវត្តិរូប</option>
        <option value="/settings">ការកំណត់</option>
        <option v-if="isAdmin" value="/admin">អ្នកគ្រប់គ្រង</option>
      </select>
    </div>

    <div class="sidebar-desktop-content">
      <p class="section-kicker text-info mb-2">ផ្ទាំងសិស្ស</p>
      <h2 class="h5 fw-bold text-white mb-4">មជ្ឈមណ្ឌលរៀន</h2>

      <div class="list-group list-group-flush sidebar-links" aria-label="មជ្ឈមណ្ឌលរៀន">
        <RouterLink class="list-group-item list-group-item-action" active-class="active" to="/dashboard">
          <i class="bi bi-speedometer2"></i>
          ទិដ្ឋភាពរួម
        </RouterLink>
        <RouterLink class="list-group-item list-group-item-action" active-class="active" to="/courses">
          <i class="bi bi-journal-code"></i>
          វគ្គសិក្សា
        </RouterLink>
        <RouterLink class="list-group-item list-group-item-action" active-class="active" to="/my-courses">
          <i class="bi bi-collection-play"></i>
          វគ្គរបស់ខ្ញុំ
        </RouterLink>
        <RouterLink class="list-group-item list-group-item-action" active-class="active" to="/notifications">
          <i class="bi bi-bell"></i>
          ការជូនដំណឹង
        </RouterLink>
        <RouterLink class="list-group-item list-group-item-action" active-class="active" to="/profile">
          <i class="bi bi-person-circle"></i>
          ប្រវត្តិរូប
        </RouterLink>
        <RouterLink class="list-group-item list-group-item-action" active-class="active" to="/settings">
          <i class="bi bi-gear"></i>
          ការកំណត់
        </RouterLink>
        <RouterLink v-if="isAdmin" class="list-group-item list-group-item-action" active-class="active" to="/admin">
          <i class="bi bi-shield-check"></i>
          អ្នកគ្រប់គ្រង
        </RouterLink>
      </div>
    </div>
  </aside>
</template>
