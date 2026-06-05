<script setup>
import { useNotifications } from '@/composables/useNotifications'

const {
  notifications,
  clearNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} = useNotifications()
</script>

<template>
  <section class="py-5">
    <div class="container">
      <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <span class="section-kicker">Notifications</span>
          <h1 class="section-title mt-2">ការជូនដំណឹង</h1>
          <p class="text-secondary mb-0">មើលសកម្មភាពថ្មីៗពីវគ្គសិក្សា quiz និង certificate។</p>
        </div>
        <div class="d-flex gap-2 align-self-lg-end">
          <button class="btn btn-outline-primary" type="button" @click="markAllNotificationsRead">
            Mark all read
          </button>
          <button class="btn btn-outline-danger" type="button" @click="clearNotifications">
            Clear
          </button>
        </div>
      </div>

      <div v-if="notifications.length" class="vstack gap-3">
        <RouterLink
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ 'notification-item--unread': !notification.read }"
          :to="notification.to"
          @click="markNotificationRead(notification.id)"
        >
          <i
            class="bi"
            :class="{
              'bi-check-circle-fill text-success': notification.type === 'success',
              'bi-exclamation-triangle-fill text-warning': notification.type === 'warning',
              'bi-info-circle-fill text-primary': notification.type === 'info',
            }"
          ></i>
          <div>
            <h2 class="h6 fw-bold mb-1">{{ notification.title }}</h2>
            <p class="text-secondary mb-1">{{ notification.message }}</p>
            <span class="small text-secondary">{{ new Date(notification.createdAt).toLocaleString() }}</span>
          </div>
        </RouterLink>
      </div>

      <div v-else class="empty-panel text-center">
        <i class="bi bi-bell display-5 text-primary"></i>
        <h2 class="h4 fw-bold mt-3">មិនទាន់មានការជូនដំណឹង</h2>
        <p class="text-secondary mb-0">សកម្មភាពថ្មីៗនឹងបង្ហាញនៅទីនេះ។</p>
      </div>
    </div>
  </section>
</template>
