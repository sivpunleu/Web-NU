<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">រំលងទៅមាតិកាសំខាន់</a>
    <Navbar />

    <main id="main-content" class="page-shell" tabindex="-1">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <div :key="route.fullPath" class="route-transition-shell">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </main>

    <Footer />
  </div>
</template>
