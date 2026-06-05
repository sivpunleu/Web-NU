<script setup>
import EmptyState from '@/components/EmptyState.vue'
</script>

<template>
  <section class="py-5">
    <div class="container">
      <EmptyState
        icon="bi-compass"
        title="រកមិនឃើញទំព័រ"
        message="ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមាន ឬត្រូវបានផ្លាស់ប្តូរ។"
      >
        <RouterLink class="btn btn-primary" to="/">
          <i class="bi bi-house me-2"></i>ត្រឡប់ទៅទំព័រដើម
        </RouterLink>
      </EmptyState>
    </div>
  </section>
</template>
