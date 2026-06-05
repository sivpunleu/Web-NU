<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import CourseCard from '@/components/CourseCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useCourseCatalog } from '@/composables/useCourseCatalog'

const search = ref('')
const selectedCategory = ref('All')
const selectedLevel = ref('All')
const currentPage = ref(1)
const isLoading = ref(true)
const perPage = 6
const { allCourses } = useCourseCatalog()

const categories = computed(() => ['All', ...new Set(allCourses.value.map((course) => course.category))])
const levels = computed(() => ['All', ...new Set(allCourses.value.map((course) => course.level))])

const filteredCourses = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return allCourses.value.filter((course) => {
    const searchableText = [
      course.title,
      course.category,
      course.level,
      course.description,
      course.instructor,
    ]
      .join(' ')
      .toLowerCase()

    const matchesSearch = !keyword || searchableText.includes(keyword)
    const matchesCategory =
      selectedCategory.value === 'All' || course.category === selectedCategory.value
    const matchesLevel = selectedLevel.value === 'All' || course.level === selectedLevel.value

    return matchesSearch && matchesCategory && matchesLevel
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCourses.value.length / perPage)))

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredCourses.value.slice(start, start + perPage)
})

const resultStart = computed(() => {
  if (!filteredCourses.value.length) return 0
  return (currentPage.value - 1) * perPage + 1
})

const resultEnd = computed(() => Math.min(currentPage.value * perPage, filteredCourses.value.length))

const visiblePages = computed(() => {
  const pages = []
  const first = Math.max(1, currentPage.value - 1)
  const last = Math.min(totalPages.value, currentPage.value + 1)

  for (let page = first; page <= last; page += 1) {
    pages.push(page)
  }

  return pages
})

watch([search, selectedCategory, selectedLevel], () => {
  currentPage.value = 1
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = pages
  }
})

onMounted(() => {
  window.setTimeout(() => {
    isLoading.value = false
  }, 250)
})

function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

function clearFilters() {
  search.value = ''
  selectedCategory.value = 'All'
  selectedLevel.value = 'All'
}
</script>

<template>
  <section class="py-5">
    <div class="container">
      <div class="row align-items-end g-4 mb-4">
        <div class="col-lg-7">
          <span class="section-kicker">បណ្ណាល័យវគ្គសិក្សា</span>
          <h1 class="section-title mt-2">រកវគ្គដែលអ្នកចង់រៀន</h1>
          <p class="text-secondary mb-0">
            ស្វែងរកវគ្គជំនាញឌីជីថលជាភាសាខ្មែរ ជាមួយ search, filter និង pagination។
          </p>
        </div>

        <div class="col-lg-5">
          <div class="catalog-summary bg-white shadow-sm">
            <strong>{{ filteredCourses.length }}</strong>
            <span>វគ្គត្រូវនឹងការស្វែងរក</span>
          </div>
        </div>
      </div>

      <div class="catalog-toolbar bg-white shadow-sm mb-4">
        <label class="form-label mb-0">
          ស្វែងរក
          <div class="input-group">
            <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
            <input
              v-model="search"
              class="form-control"
              type="search"
              placeholder="ឧ. Vue, Laravel, Data"
            />
          </div>
        </label>

        <label class="form-label mb-0">
          ប្រភេទ
          <select v-model="selectedCategory" class="form-select">
            <option v-for="category in categories" :key="category" :value="category">
              {{ category === 'All' ? 'ទាំងអស់' : category }}
            </option>
          </select>
        </label>

        <label class="form-label mb-0">
          កម្រិត
          <select v-model="selectedLevel" class="form-select">
            <option v-for="level in levels" :key="level" :value="level">
              {{ level === 'All' ? 'ទាំងអស់' : level }}
            </option>
          </select>
        </label>

        <button class="btn btn-outline-secondary align-self-end" type="button" @click="clearFilters">
          <i class="bi bi-arrow-counterclockwise me-1"></i>សម្អាត
        </button>
      </div>

      <LoadingSkeleton v-if="isLoading" />

      <div
        v-else-if="paginatedCourses.length"
        class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 courses-grid"
      >
        <div v-for="course in paginatedCourses" :key="course.id" class="col">
          <CourseCard :course="course" />
        </div>
      </div>

      <EmptyState
        v-else
        icon="bi-search"
        title="រកមិនឃើញវគ្គ"
        message="សូមសាកល្បងពាក្យស្វែងរក ឬ filter ផ្សេងទៀត។"
      >
        <button class="btn btn-primary" type="button" @click="clearFilters">បង្ហាញទាំងអស់</button>
      </EmptyState>

      <div
        v-if="!isLoading && filteredCourses.length"
        class="pagination-shell d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4"
      >
        <p class="text-secondary mb-0">
          បង្ហាញ {{ resultStart }}-{{ resultEnd }} ក្នុងចំណោម {{ filteredCourses.length }} វគ្គ
        </p>

        <nav aria-label="Course pagination">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" type="button" @click="changePage(currentPage - 1)">
                មុន
              </button>
            </li>

            <li v-if="!visiblePages.includes(1)" class="page-item">
              <button class="page-link" type="button" @click="changePage(1)">1</button>
            </li>

            <li v-if="visiblePages[0] > 2" class="page-item disabled">
              <span class="page-link">...</span>
            </li>

            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" type="button" @click="changePage(page)">
                {{ page }}
              </button>
            </li>

            <li v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="page-item disabled">
              <span class="page-link">...</span>
            </li>

            <li v-if="!visiblePages.includes(totalPages)" class="page-item">
              <button class="page-link" type="button" @click="changePage(totalPages)">
                {{ totalPages }}
              </button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" type="button" @click="changePage(currentPage + 1)">
                បន្ទាប់
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </section>
</template>
