<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAdmin } = useAuth()
</script>

<template>
  <aside class="student-sidebar" data-aos="fade-right">
    <p class="section-kicker text-info mb-2">ផ្ទាំងសិស្ស</p>
    <h2 class="h5 fw-bold text-white mb-4">មជ្ឈមណ្ឌលរៀន</h2>

    <div class="list-group list-group-flush sidebar-links">
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
        Settings
      </RouterLink>
      <RouterLink v-if="isAdmin" class="list-group-item list-group-item-action" active-class="active" to="/admin">
        <i class="bi bi-shield-check"></i>
        Admin
      </RouterLink>
    </div>
  </aside>
</template>
