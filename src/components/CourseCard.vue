<script setup>
import { computed } from 'vue'
import { useCourseReviews } from '@/composables/useCourseReviews'
import { useLearning } from '@/composables/useLearning'

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
})

const { isFavorite, toggleFavorite } = useLearning()
const { getAverageRating } = useCourseReviews()
const favorite = computed(() => isFavorite(props.course.id))
const displayRating = computed(() => getAverageRating(props.course.id, props.course.rating))
</script>

<template>
  <article class="card course-card h-100 border-0 shadow-sm" data-aos="fade-up">
    <div class="course-thumb" :style="{ '--course-accent': course.accent }">
      <img v-if="course.image" class="course-thumb__image" :src="course.image" :alt="course.title" />
      <div class="course-thumb__overlay">
        <span class="badge text-bg-dark">{{ course.category }}</span>
        <div class="d-flex align-items-center gap-2">
          <span class="course-price">{{ course.price }}</span>
          <button
            class="course-favorite-btn"
            :class="{ 'course-favorite-btn--active': favorite }"
            type="button"
            :aria-label="favorite ? 'ដកចេញពីវគ្គពេញចិត្ត' : 'រក្សាទុកវគ្គពេញចិត្ត'"
            @click="toggleFavorite(course.id)"
          >
            <i class="bi" :class="favorite ? 'bi-bookmark-fill' : 'bi-bookmark'"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-center gap-2 small text-secondary mb-3">
        <span class="course-meta-pill">
          <i class="bi bi-bar-chart me-1"></i>{{ course.level }}
        </span>
        <span class="course-meta-pill">
          <i class="bi bi-clock me-1"></i>{{ course.duration }}
        </span>
      </div>

      <h3 class="h5 fw-bold mb-2">{{ course.title }}</h3>
      <p class="course-card-description text-secondary flex-grow-1">{{ course.description }}</p>

      <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-2 small">
        <span class="text-secondary">
          <i class="bi bi-play-circle me-1"></i>{{ course.lessonsCount }} មេរៀន
        </span>
        <span class="fw-semibold text-warning">
          <i class="bi bi-star-fill me-1"></i>{{ displayRating }}
        </span>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-2 small text-secondary">
        <span><i class="bi bi-person-video3 me-1"></i>{{ course.instructor }}</span>
        <span><i class="bi bi-people me-1"></i>{{ course.students }}</span>
      </div>

      <RouterLink class="btn btn-primary w-100 mt-3" :to="`/courses/${course.id}`">
        មើលលម្អិត
      </RouterLink>
    </div>
  </article>
</template>
