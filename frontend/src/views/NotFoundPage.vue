<template>
  <div class="not-found-page">
    <div class="container">
      <div class="error-wrapper">
        
        <div class="code-visual">
          <span class="digit">4</span>
          
          <div class="road-zero">
            <div class="inner-glow"></div>

            <div class="track">
              <div class="car-anchor car-1">
                <div class="car">🚗</div>
              </div>
              <div class="car-anchor car-2">
                <div class="car">🚕</div>
              </div>
              <div class="car-anchor car-3">
                <div class="car">🚙</div>
              </div>
            </div>
          </div>
          
          <span class="digit">4</span>
        </div>

        <p class="error-message">
          Похоже, этот маршрут завел вас в тупик.<br>
          Такой страницы не существует.
        </p>
        
        <router-link to="/" class="btn-primary">
          Вернуться на трассу
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0b0b0b;
  color: #fff;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

.error-wrapper {
  text-align: center;
  padding: 20px;
}

.code-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
}

.digit {
  font-size: clamp(100px, 18vw, 200px);
  font-weight: 800;
  line-height: 1;
  color: #fff;
  letter-spacing: -5px;
}

.road-zero {
  position: relative;
  width: clamp(100px, 18vw, 200px);
  height: clamp(100px, 18vw, 200px);
  background-color: #1a1a1a;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(0, 220, 130, 0.4);
  border: 4px dashed rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.inner-glow {
  position: absolute;
  width: 50%;
  height: 50%;
  background-color: #0b0b0b;
  border-radius: 50%;
  box-shadow: 0 0 25px #00dc82;
  border: 2px solid #00dc82;
  z-index: 2;
}

.track {
  position: absolute;
  width: 100%;
  height: 100%;
  /* ИЗМЕНЕНО: Направление анимации теперь по часовой стрелке */
  animation: rotateTrack 10s linear infinite;
  z-index: 3;
}

.car-anchor {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 0;
  transform-origin: left center;
}

/* Расстановка */
.car-1 { transform: rotate(-90deg); }
.car-2 { transform: rotate(30deg); }
.car-3 { transform: rotate(150deg); }

.car {
  position: absolute;
  right: 0;
  top: 0;
  font-size: clamp(16px, 2.5vw, 28px);
  /* rotate(-90deg) разворачивает их носом в другую сторону для движения по часовой */
  transform: translate(50%, -50%) rotate(-90deg);
  white-space: nowrap;
}

/* ИЗМЕНЕНО: Анимация теперь идет от 0 до 360 (по часовой стрелке) */
@keyframes rotateTrack {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-message {
  color: #aaa;
  font-size: 18px;
  max-width: 450px;
  margin: 0 auto 50px;
  line-height: 1.6;
}

.btn-primary {
  display: inline-block;
  padding: 16px 36px;
  background-color: #00dc82;
  color: #000;
  text-decoration: none;
  border-radius: 100px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.btn-primary:hover {
  background-color: #00ff95;
  transform: translateY(-2px);
}
</style>