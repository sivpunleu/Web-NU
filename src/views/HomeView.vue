<script setup>
import { computed } from 'vue'
import HeroSection from '@/components/HeroSection.vue'
import CourseCard from '@/components/CourseCard.vue'
import { useCourseCatalog } from '@/composables/useCourseCatalog'

const { allCourses } = useCourseCatalog()
const featuredCourses = computed(() => allCourses.value.slice(0, 3))

const stats = [
  { icon: 'bi-people', value: '៥.៦k+', label: 'សិស្សសកម្ម', tone: 'blue' },
  { icon: 'bi-play-btn', value: '១៤៣', label: 'មេរៀនវីដេអូ', tone: 'green' },
  { icon: 'bi-terminal', value: '៩+', label: 'បន្ទប់អនុវត្ត', tone: 'violet' },
  { icon: 'bi-star', value: '៤.៨', label: 'ពិន្ទុមធ្យម', tone: 'amber' },
]

const learningPaths = [
  {
    icon: 'bi-code-slash',
    title: 'Web Development',
    text: 'Vue, Laravel, Node.js និង dashboard project សម្រាប់ portfolio។',
  },
  {
    icon: 'bi-palette',
    title: 'Design System',
    text: 'UI/UX, Figma, accessibility និង handoff ដែល developer យកទៅធ្វើបាន។',
  },
  {
    icon: 'bi-bar-chart-line',
    title: 'Data & Security',
    text: 'Data analytics, dashboard insight និង cybersecurity habits សម្រាប់ការងារ។',
  },
]

const workflowSteps = [
  { icon: 'bi-map', title: 'ជ្រើសផ្លូវរៀន', text: 'ចាប់ផ្តើមពី course path ដែលសាកសមនឹងកម្រិតនិងគោលដៅរបស់អ្នក។' },
  { icon: 'bi-camera-video', title: 'រៀនតាមមេរៀន', text: 'មេរៀនមាន objective, practice, resource និង deliverable ច្បាស់។' },
  { icon: 'bi-terminal', title: 'អនុវត្តក្នុង Lab', text: 'សរសេរ code, run preview និងរក្សាទុក draft ដើម្បីបញ្ចប់លំហាត់។' },
  { icon: 'bi-award', title: 'បញ្ចប់ និងទទួលសញ្ញាបត្រ', text: 'Mark progress, ធ្វើ quiz និងបង្កើត certificate ពេលបញ្ចប់វគ្គ។' },
]
</script>

<template>
  <HeroSection />

  <section class="landing-stats-section">
    <div class="container">
      <div class="landing-stats">
        <div v-for="stat in stats" :key="stat.label" class="stat-card landing-stat-card" :class="`landing-stat-card--${stat.tone}`">
          <i class="bi" :class="stat.icon"></i>
          <div>
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="landing-section">
    <div class="container">
      <div class="landing-section__header">
        <div>
          <span class="section-kicker">Learning paths</span>
          <h2 class="section-title mt-2">ផ្លូវរៀនដែលរៀបចំសម្រាប់ចូលការងារ</h2>
        </div>
        <RouterLink class="btn btn-outline-primary align-self-lg-end" to="/courses">
          មើលផ្លូវទាំងអស់
        </RouterLink>
      </div>

      <div class="landing-path-grid">
        <article v-for="path in learningPaths" :key="path.title" class="landing-path-card">
          <i class="bi" :class="path.icon"></i>
          <h3>{{ path.title }}</h3>
          <p>{{ path.text }}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="landing-section section-soft">
    <div class="container">
      <div class="landing-section__header">
        <div>
          <span class="section-kicker">វគ្គពេញនិយម</span>
          <h2 class="section-title mt-2">ជ្រើសរើសវគ្គសិក្សាដែលសាកសមនឹងអ្នក</h2>
        </div>
        <RouterLink class="btn btn-outline-primary align-self-lg-end" to="/courses">
          មើលវគ្គទាំងអស់
        </RouterLink>
      </div>

      <div class="row g-4">
        <div v-for="course in featuredCourses" :key="course.id" class="col-md-6 col-xl-4">
          <CourseCard :course="course" />
        </div>
      </div>
    </div>
  </section>

  <section class="landing-section">
    <div class="container">
      <div class="landing-section__header">
        <div>
          <span class="section-kicker">Learning flow</span>
          <h2 class="section-title mt-2">រៀនពីចំណុចចាប់ផ្តើម ដល់លទ្ធផលដែលអាចបង្ហាញបាន</h2>
        </div>
      </div>

      <div class="landing-workflow">
        <article v-for="(step, index) in workflowSteps" :key="step.title" class="landing-workflow-step">
          <span>{{ index + 1 }}</span>
          <i class="bi" :class="step.icon"></i>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="landing-section">
    <div class="container">
      <div class="learning-cta landing-final-cta">
        <div>
          <span class="section-kicker">SmartLearn ខ្មែរ</span>
          <h2 class="fw-bold mt-2 mb-2">ចាប់ផ្តើមវគ្គដំបូងរបស់អ្នកថ្ងៃនេះ</h2>
          <p class="mb-0">រៀនតាម lesson path, អនុវត្តជាមួយ task និងតាមដាន progress របស់អ្នកក្នុង dashboard។</p>
        </div>
        <RouterLink class="btn btn-primary btn-lg" to="/register">ចូលរួមឥឡូវនេះ</RouterLink>
      </div>
    </div>
  </section>
</template>
