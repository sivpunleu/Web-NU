<template>
  <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4" aria-hidden="true">
    <div v-for="item in 6" :key="item" class="col">
      <div class="card border-0 shadow-sm h-100">
        <div class="skeleton skeleton-thumb"></div>
        <div class="card-body">
          <div class="skeleton skeleton-line skeleton-line--short mb-3"></div>
          <div class="skeleton skeleton-line mb-2"></div>
          <div class="skeleton skeleton-line mb-2"></div>
          <div class="skeleton skeleton-line skeleton-line--medium"></div>
        </div>
      </div>
    </div>
  </div>
</template>
