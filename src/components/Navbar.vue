<script setup>
import { useRoute, useRouter } from 'vue-router'
import logo from '@/assets/images/logo.jpg'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()
const router = useRouter()
const { currentUser, isAdmin, logout } = useAuth()
const { unreadCount } = useNotifications()

const navLinks = [
  { label: 'ទំព័រដើម', to: '/', icon: 'bi-house' },
  { label: 'វគ្គសិក្សា', to: '/courses', icon: 'bi-journal-code' },
  { label: 'វគ្គរបស់ខ្ញុំ', to: '/my-courses', icon: 'bi-collection-play' },
  { label: 'Practice Lab', to: '/practice-lab', icon: 'bi-terminal' },
  { label: 'Dashboard', to: '/dashboard', icon: 'bi-speedometer2' },
]

function handleLogout() {
  logout()

  if (route.meta.requiresAuth) {
    router.push('/login')
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-xl app-navbar sticky-top">
    <div class="container">
      <div class="navbar-shell">
        <RouterLink class="navbar-brand brand-lockup" to="/">
          <img :src="logo" alt="SmartLearn ខ្មែរ" class="brand-logo" />
        </RouterLink>

        <button
          class="navbar-toggler app-navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="mainNavbar" class="collapse navbar-collapse">
          <ul class="navbar-nav nav-pills-shell mx-xl-auto">
            <li v-for="link in navLinks" :key="link.to" class="nav-item">
              <RouterLink
                class="nav-link app-nav-link"
                active-class="active"
                :exact-active-class="link.to === '/' ? 'active' : ''"
                :to="link.to"
              >
                <i class="bi" :class="link.icon"></i>
                <span>{{ link.label }}</span>
              </RouterLink>
            </li>
            <li v-if="isAdmin" class="nav-item">
              <RouterLink class="nav-link app-nav-link nav-link-admin" active-class="active" to="/admin">
                <i class="bi bi-shield-check"></i>
                <span>Admin</span>
              </RouterLink>
            </li>
          </ul>

          <div class="navbar-actions">
            <RouterLink class="nav-icon-button notification-link" to="/notifications" aria-label="Notifications">
              <i class="bi bi-bell"></i>
              <span v-if="unreadCount" class="notification-badge">{{ unreadCount }}</span>
            </RouterLink>

            <template v-if="!currentUser">
              <RouterLink class="btn btn-outline-primary nav-auth-button" to="/login">
                <i class="bi bi-box-arrow-in-right me-2"></i>ចូលគណនី
              </RouterLink>
              <RouterLink class="btn btn-primary nav-auth-button" to="/register">
                <i class="bi bi-person-plus me-2"></i>ចុះឈ្មោះ
              </RouterLink>
            </template>

            <template v-else>
              <RouterLink class="nav-icon-button" to="/settings" aria-label="Settings">
                <i class="bi bi-gear"></i>
              </RouterLink>

              <RouterLink class="user-chip" to="/profile" :aria-label="`ទៅ Profile របស់ ${currentUser.name}`">
                <span class="user-avatar">
                  <img
                    v-if="currentUser.avatarUrl"
                    :src="currentUser.avatarUrl"
                    :alt="`${currentUser.name} profile`"
                  />
                  <span v-else>{{ currentUser.name?.charAt(0) ?? 'S' }}</span>
                </span>
                <span class="user-chip__text">
                  <strong>{{ currentUser.name }}</strong>
                  <small>Profile · {{ isAdmin ? 'Admin' : 'Student' }}</small>
                </span>
              </RouterLink>

              <button class="nav-icon-button nav-logout" type="button" aria-label="Logout" @click="handleLogout">
                <i class="bi bi-box-arrow-right"></i>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.brand-logo {
  height: 44px;
  width: auto;
}
</style>  
