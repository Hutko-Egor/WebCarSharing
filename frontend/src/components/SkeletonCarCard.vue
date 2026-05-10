<template>
  <div class="car-card skeleton">
    <div class="car-image skeleton-block"></div>

    <div class="car-info">
      <div class="skeleton-title skeleton-block"></div>
      
      <div class="skeleton-text skeleton-block"></div>
      
      <div class="car-specs">
        <div class="spec skeleton-spec skeleton-block"></div>
        <div class="spec skeleton-spec skeleton-block"></div>
      </div>
      
      <div class="car-price">
        <div class="skeleton-price skeleton-block"></div>
        <div class="skeleton-btn skeleton-block"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Базовая карточка (копируем геометрию вашей .car-card) */
.car-card.skeleton {
  pointer-events: none; /* Чтобы нельзя было кликнуть */
}

/* Общий стиль для всех блоков скелетона */
.skeleton-block {
  background: #eee;
  background: linear-gradient(
    110deg,
    rgb(70, 69, 69) 8%,
    rgb(70, 69, 69) 18%,
    rgb(70, 69, 69) 33%
  );
  background-size: 200% 100%;
  animation: shine 1.5s linear infinite;
  border-radius: 4px;
}

/* Специфичные размеры под вашу верстку */
.car-image.skeleton-block {
  width: 100%;
  height: 200px; /* Должно совпадать с высотой ваших реальных фото */
  border-radius: 12px 12px 0 0;
}

.skeleton-title {
  height: 24px;
  width: 70%;
  margin-bottom: 12px;
}

.skeleton-text {
  height: 16px;
  width: 50%;
  margin-bottom: 15px;
}

.skeleton-spec {
  height: 20px;
  width: 80px;
  display: inline-block;
}

.skeleton-price {
  height: 24px;
  width: 100px;
}

.skeleton-btn {
  height: 36px;
  width: 120px;
  border-radius: 8px;
}

/* Анимация перелива */
@keyframes shine {
  to {
    background-position-x: -200%;
  }
}

/* Адаптация под List View (если вы используете переключатель viewMode) */
/* Если в CatalogPage активен класс .view-list, скелетон тоже должен перестроиться */
:deep(.view-list) .car-card.skeleton {
  display: flex;
  gap: 20px;
}
</style>