<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})

const pages = {
  privacy: {
    kicker: 'Privacy',
    title: 'គោលការណ៍ឯកជនភាព',
    intro:
      'SmartLearn ខ្មែរ រក្សាទុកទិន្នន័យគណនី និងវឌ្ឍនភាពសិក្សា ដើម្បីផ្ដល់បទពិសោធន៍រៀនដែលមានប្រសិទ្ធភាព។',
    items: [
      'យើងប្រើព័ត៌មានគណនីសម្រាប់ login, profile និង progress tracking។',
      'ទិន្នន័យ demo ត្រូវបានប្រើសម្រាប់បង្ហាញមុខងារនៅក្នុង project នេះ។',
      'អ្នកអាចកែព័ត៌មាន profile របស់អ្នកពីទំព័រ Profile បានគ្រប់ពេល។',
    ],
  },
  terms: {
    kicker: 'Terms',
    title: 'លក្ខខណ្ឌប្រើប្រាស់',
    intro:
      'ការប្រើ SmartLearn ខ្មែរ មានគោលបំណងជួយរៀនជំនាញឌីជីថលតាមមេរៀន, lab, quiz និង certificate។',
    items: [
      'គណនី demo និងមាតិកា course ត្រូវបានរៀបចំសម្រាប់ការសិក្សា និងការបង្ហាញ project។',
      'អ្នកគួរប្រើ Practice Lab សម្រាប់សាកល្បង code និងរក្សាទុក draft ផ្ទាល់ខ្លួន។',
      'Admin អាចបង្កើត កែ និងគ្រប់គ្រងវគ្គសិក្សាដើម្បីរក្សាគុណភាពមាតិកា។',
    ],
  },
}

const page = computed(() => pages[props.type] ?? pages.privacy)
</script>

<template>
  <section class="legal-page py-5">
    <div class="container">
      <div class="content-panel legal-panel mx-auto">
        <span class="section-kicker">{{ page.kicker }}</span>
        <h1 class="section-title mt-2">{{ page.title }}</h1>
        <p class="text-secondary mb-4">{{ page.intro }}</p>

        <ul class="legal-list">
          <li v-for="item in page.items" :key="item">
            <i class="bi bi-check2-circle"></i>
            <span>{{ item }}</span>
          </li>
        </ul>

        <RouterLink class="btn btn-primary mt-4" to="/">
          <i class="bi bi-house me-2"></i>ត្រឡប់ទៅទំព័រដើម
        </RouterLink>
      </div>
    </div>
  </section>
</template>
