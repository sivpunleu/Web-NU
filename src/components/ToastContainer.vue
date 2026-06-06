<script setup>
import { useNotifications } from '@/composables/useNotifications'

const { dismissToast, toasts } = useNotifications()
</script>

<template>
  <Teleport to="body">
    <div class="app-toast-stack" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast">
        <article
          v-for="toast in toasts"
          :key="toast.id"
          class="app-toast"
          :class="`app-toast--${toast.type}`"
          role="status"
        >
          <span class="app-toast__icon">
            <i
              class="bi"
              :class="{
                'bi-check-lg': toast.type === 'success',
                'bi-exclamation-lg': toast.type === 'warning',
                'bi-info-lg': toast.type === 'info',
                'bi-x-lg': toast.type === 'error',
              }"
            ></i>
          </span>
          <div class="app-toast__content">
            <strong>{{ toast.title }}</strong>
            <p>{{ toast.message }}</p>
          </div>
          <button
            class="app-toast__close"
            type="button"
            aria-label="បិទការជូនដំណឹង"
            @click="dismissToast(toast.id)"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
