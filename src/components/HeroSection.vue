<script setup>
import logo from '@/assets/images/logo.jpg'
</script>

<template>
  <section class="kh-hero landing-hero">
    <div class="landing-hero__scene" aria-hidden="true">
      <div class="landing-dashboard landing-dashboard--main">
        <div class="landing-dashboard__header">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="landing-dashboard__body">
          <div class="landing-dashboard__sidebar">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="landing-dashboard__content">
            <div class="landing-dashboard__chart">
              <span style="--bar-height: 42%"></span>
              <span style="--bar-height: 68%"></span>
              <span style="--bar-height: 54%"></span>
              <span style="--bar-height: 82%"></span>
              <span style="--bar-height: 64%"></span>
            </div>
            <div class="landing-dashboard__tiles">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="landing-mini-panel landing-mini-panel--progress">
        <i class="bi bi-graph-up-arrow"></i>
        <strong>៨២%</strong>
        <span>គោលដៅសប្តាហ៍</span>
      </div>

      <div class="landing-mini-panel landing-mini-panel--students">
        <i class="bi bi-people"></i>
        <strong>៥.៦k+</strong>
        <span>សិស្សសកម្ម</span>
      </div>
    </div>

    <div class="container">
      <div class="landing-hero__content" data-aos="fade-up">
        <RouterLink class="landing-brand-pill" to="/">
          <img :src="logo" alt="SmartLearn Logo" />
          <span>SmartLearn ខ្មែរ</span>
        </RouterLink>

        <h1>SmartLearn ខ្មែរ</h1>
        <p>
          វេទិកា e-learning សម្រាប់រៀន programming, design, data និង cybersecurity
          ជាមួយ lesson path ច្បាស់ dashboard តាមដានវឌ្ឍនភាព និង certificate។
        </p>

        <div class="landing-hero__actions">
          <RouterLink class="btn btn-primary btn-lg" to="/courses">
            <i class="bi bi-journal-code me-2"></i>ចាប់ផ្តើមរៀន
          </RouterLink>
          <RouterLink class="btn btn-light btn-lg" to="/dashboard">
            <i class="bi bi-speedometer2 me-2"></i>មើល Dashboard
          </RouterLink>
        </div>

        <div class="landing-hero__meta">
          <span><i class="bi bi-check2-circle"></i>វគ្គអនុវត្តពិត</span>
          <span><i class="bi bi-check2-circle"></i>Quiz និង Certificate</span>
          <span><i class="bi bi-check2-circle"></i>រៀនជាភាសាខ្មែរ</span>
        </div>
      </div>
    </div>
  </section>
</template>
