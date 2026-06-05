<script setup>
import { computed } from 'vue'

const props = defineProps({
  caption: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'bi-bar-chart-line',
  },
  label: {
    type: String,
    default: 'Progress',
  },
  tone: {
    type: String,
    default: 'blue',
  },
  value: {
    type: Number,
    default: 0,
  },
})

const normalizedValue = computed(() => Math.min(100, Math.max(0, Math.round(props.value))))

const toneColor = computed(() => {
  const colors = {
    amber: 'var(--kh-amber)',
    blue: 'var(--kh-blue)',
    green: 'var(--kh-green)',
    violet: 'var(--kh-violet)',
  }

  return colors[props.tone] ?? colors.blue
})

const ringStyle = computed(() => ({
  '--progress-angle': `${normalizedValue.value * 3.6}deg`,
  '--progress-color': toneColor.value,
}))
</script>

<template>
  <article class="progress-chart-card">
    <div class="progress-chart-card__header">
      <span><i class="bi" :class="icon"></i></span>
      <div>
        <strong>{{ label }}</strong>
        <small v-if="caption">{{ caption }}</small>
      </div>
    </div>

    <div class="progress-ring" :style="ringStyle">
      <div>
        <strong>{{ normalizedValue }}%</strong>
        <span>Complete</span>
      </div>
    </div>
  </article>
</template>
