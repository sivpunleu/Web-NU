<script setup>
import logo from '@/assets/images/logo.jpg'
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-cta" data-aos="fade-up">
        <div>
          <span class="section-kicker">SmartLearn ខ្មែរ</span>
          <h2>បន្តរៀនជំនាញឌីជីថលរបស់អ្នក</h2>
        </div>
        <div class="footer-cta__actions">
          <RouterLink class="btn btn-primary" to="/courses">
            <i class="bi bi-journal-code me-2"></i>មើលវគ្គ
          </RouterLink>
          <RouterLink class="btn btn-outline-primary" to="/dashboard">
            <i class="bi bi-speedometer2 me-2"></i>Dashboard
          </RouterLink>
        </div>
      </div>

      <div class="footer-main">
        <div class="footer-brand">
          <RouterLink class="brand-lockup footer-brand-lockup" to="/">
            <img :src="logo" alt="SmartLearn ខ្មែរ" class="footer-logo" />
          </RouterLink>
          <p>
            វេទិកា e-learning សម្រាប់រៀន programming, design, data និង security ជាភាសាខ្មែរ។
          </p>

          <div class="footer-socials" aria-label="Social links">
            <a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="https://telegram.org/" aria-label="Telegram" target="_blank" rel="noopener noreferrer">
              <i class="bi bi-telegram"></i>
            </a>
            <a href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <i class="bi bi-youtube"></i>
            </a>
            <a href="https://github.com/" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <i class="bi bi-github"></i>
            </a>
          </div>
        </div>

        <div class="footer-column">
          <h2>មាតិកា</h2>
          <RouterLink to="/courses">វគ្គសិក្សា</RouterLink>
          <RouterLink to="/my-courses">វគ្គរបស់ខ្ញុំ</RouterLink>
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <RouterLink to="/notifications">ការជូនដំណឹង</RouterLink>
        </div>

        <div class="footer-column">
          <h2>គណនី</h2>
          <RouterLink to="/login">ចូលគណនី</RouterLink>
          <RouterLink to="/forgot-password">ភ្លេចពាក្យសម្ងាត់</RouterLink>
          <RouterLink to="/register">ចុះឈ្មោះ</RouterLink>
          <RouterLink to="/profile">ប្រវត្តិរូប</RouterLink>
          <RouterLink to="/settings">Settings</RouterLink>
          <RouterLink to="/admin">Admin</RouterLink>
        </div>

        <div class="footer-contact">
          <h2>ទំនាក់ទំនង</h2>
          <a href="mailto:support@smartlearn.kh">
            <i class="bi bi-envelope"></i>
            support@smartlearn.kh
          </a>
          <a href="tel:+85512345678">
            <i class="bi bi-telephone"></i>
            +855 12 345 678
          </a>
          <span>
            <i class="bi bi-geo-alt"></i>
            Phnom Penh, Cambodia
          </span>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 SmartLearn ខ្មែរ</span>
        <div>
          <RouterLink to="/privacy">Privacy</RouterLink>
          <RouterLink to="/terms">Terms</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
