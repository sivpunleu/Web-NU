<script setup>
defineProps({
  icon: {
    type: String,
    default: 'bi-inbox',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="empty-panel text-center" data-aos="zoom-in">
    <i class="bi display-5 text-primary" :class="icon"></i>
    <h2 class="h4 fw-bold mt-3">{{ title }}</h2>
    <p class="text-secondary mb-0">{{ message }}</p>
    <div v-if="$slots.default" class="mt-3">
      <slot />
    </div>
  </div>
</template>
