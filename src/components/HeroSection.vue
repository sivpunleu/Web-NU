<template>
  <section class="kh-hero landing-hero">
    <div class="container">
      <div class="landing-hero__layout">
        <div class="landing-hero__content" data-aos="fade-up">
          <span class="landing-brand-pill">
            <i class="bi bi-stars"></i>
            វេទិការៀនជាភាសាខ្មែរ
          </span>

          <h1>
            រៀនជំនាញឌីជីថល
            <span>បង្កើតអនាគតរបស់អ្នក</span>
          </h1>
          <p>
            ផ្លូវរៀនច្បាស់ មេរៀនអនុវត្តពិត និង dashboard តាមដានវឌ្ឍនភាព
            សម្រាប់ Web, Design, Data និង Cybersecurity។
          </p>

          <div class="landing-hero__actions">
            <RouterLink class="btn btn-primary btn-lg" to="/courses">
              មើលវគ្គសិក្សា<i class="bi bi-arrow-right ms-2"></i>
            </RouterLink>
            <RouterLink class="btn landing-hero__secondary btn-lg" to="/dashboard">
              <i class="bi bi-play-circle me-2"></i>មើល Dashboard
            </RouterLink>
          </div>

          <div class="landing-hero__meta">
            <span><i class="bi bi-check-circle-fill"></i>រៀនតាមល្បឿនខ្លួនឯង</span>
            <span><i class="bi bi-check-circle-fill"></i>មាន Quiz និង Certificate</span>
          </div>
        </div>

        <div class="landing-hero__visual" data-aos="fade-left" data-aos-delay="100" aria-hidden="true">
          <div class="hero-product-card">
            <div class="hero-product-card__topbar">
              <div class="hero-product-card__brand">
                <span>SL</span>
                <div>
                  <strong>SmartLearn</strong>
                  <small>Learning dashboard</small>
                </div>
              </div>
              <span class="hero-live-pill"><i class="bi bi-circle-fill"></i> Online</span>
            </div>

            <div class="hero-product-card__body">
              <aside class="hero-product-card__nav">
                <i class="bi bi-grid-fill active"></i>
                <i class="bi bi-journal-code"></i>
                <i class="bi bi-terminal"></i>
                <i class="bi bi-award"></i>
              </aside>

              <div class="hero-product-card__main">
                <div class="hero-product-card__heading">
                  <div>
                    <small>វឌ្ឍនភាពសប្តាហ៍នេះ</small>
                    <strong>បន្តការសិក្សារបស់អ្នក</strong>
                  </div>
                  <span>៧២%</span>
                </div>

                <div class="hero-chart">
                  <span style="--bar-height: 44%"></span>
                  <span style="--bar-height: 62%"></span>
                  <span style="--bar-height: 54%"></span>
                  <span style="--bar-height: 78%"></span>
                  <span style="--bar-height: 68%"></span>
                  <span style="--bar-height: 88%"></span>
                </div>

                <div class="hero-course-row">
                  <span class="hero-course-row__icon"><i class="bi bi-code-slash"></i></span>
                  <div>
                    <strong>Frontend Development</strong>
                    <span><i style="width: 72%"></i></span>
                  </div>
                  <small>៧២%</small>
                </div>

                <div class="hero-course-row">
                  <span class="hero-course-row__icon hero-course-row__icon--green">
                    <i class="bi bi-bar-chart"></i>
                  </span>
                  <div>
                    <strong>Data Analytics</strong>
                    <span><i style="width: 48%"></i></span>
                  </div>
                  <small>៤៨%</small>
                </div>
              </div>
            </div>
          </div>

          <div class="hero-achievement-card">
            <i class="bi bi-trophy-fill"></i>
            <div>
              <strong>គោលដៅបានសម្រេច</strong>
              <span>៥ ថ្ងៃជាប់គ្នា</span>
            </div>
            <b>+12</b>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
