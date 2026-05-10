<template>
  <div class="faq-page">
    <section class="faq-hero">
      <div class="container">
        <h1>Часто задаваемые <span>вопросы</span></h1>
        <p>Найдите ответы на популярные вопросы о нашем сервисе</p>

        <div class="search-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Поиск по вопросам..." 
            class="search-input"
          >
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="container">
        <div class="faq-layout">
          
          <aside class="faq-nav">
            <h3>Категории</h3>
            <ul class="category-list">
              <li v-for="cat in faqData" :key="cat.id">
                <a 
                  :href="'#' + cat.id" 
                  :class="{ active: activeCategory === cat.id }"
                  @click.prevent="scrollTo(cat.id)"
                >
                  {{ cat.title }}
                </a>
              </li>
            </ul>
          </aside>

          <main class="faq-content">
            <div 
              v-for="cat in filteredFaq" 
              :key="cat.id" 
              :id="cat.id" 
              class="faq-category"
            >
              <h2>{{ cat.title }}</h2>

              <div 
                v-for="(item, idx) in cat.items" 
                :key="cat.id + idx"
                class="faq-item"
                :class="{ active: openedItems[cat.id + idx] }"
              >
                <button class="faq-question" @click="toggleItem(cat.id, idx)">
                  <span>{{ item.question }}</span>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                  </svg>
                </button>

                <div class="faq-answer">
                  <div class="answer-content">
                    <template v-if="typeof item.answer === 'string'">
                      <p>{{ item.answer }}</p>
                    </template>
                    <template v-else>
                      <p>{{ item.answer.text }}</p>
                      <ul>
                        <li v-for="(li, i) in item.answer.list" :key="i">{{ li }}</li>
                      </ul>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="filteredFaq.length === 0" class="no-results">
              По вашему запросу ничего не найдено
            </div>
          </main>
        </div>
      </div>
    </section>

    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const searchQuery = ref('');
const activeCategory = ref('registration');
const openedItems = ref({});

const faqData = ref([
  {
    id: 'registration',
    title: 'Регистрация',
    items: [
      {
        question: 'Как зарегистрироваться в сервисе?',
        answer: 'Для регистрации нажмите кнопку «Регистрация» в правом верхнем углу сайта. Заполните форму: укажите имя, email, номер телефона и придумайте пароль. После этого вам придет SMS с кодом подтверждения.'
      },
      {
        question: 'Какие документы нужны для аренды?',
        answer: {
          text: 'Для аренды автомобиля вам понадобятся:',
          list: ['Действующее водительское удостоверение (категория B)', 'Паспорт гражданина', 'Стаж вождения от 2 лет', 'Возраст от 21 года']
        }
      },
      {
        question: 'Сколько стоит регистрация?',
        answer: 'Регистрация в сервисе полностью бесплатна. Вы платите только за фактическое использование автомобиля — поминутно или почасово.'
      }
    ]
  },
  {
    id: 'booking',
    title: 'Бронирование',
    items: [
      {
        question: 'Как забронировать автомобиль?',
        answer: 'Выберите автомобиль в каталоге, нажмите «Забронировать», укажите дату и время начала аренды, а также длительность.'
      },
      {
        question: 'Можно ли отменить бронирование?',
        answer: 'Да, вы можете отменить бронирование бесплатно не позднее чем за 30 минут до начала аренды.'
      }
    ]
  },
  {
    id: 'payment',
    title: 'Оплата',
    items: [
      {
        question: 'Какие способы оплаты доступны?',
        answer: 'Мы принимаем оплату банковскими картами (Visa, Mastercard, МИР), а также через системы Apple Pay и Google Pay.'
      },
      {
        question: 'Что входит в стоимость аренды?',
        answer: {
          text: 'В стоимость аренды включены:',
          list: ['Топливо / зарядка', 'Страховка КАСКО и ОСАГО', 'Мойка', 'Техническое обслуживание']
        }
      }
    ]
  },
  {
    id: 'usage',
    title: 'Использование',
    items: [
      {
        question: 'Как открыть автомобиль?',
        answer: 'Автомобиль открывается через мобильное приложение. Подойдите к машине, нажмите кнопку «Открыть» — двери разблокируются.'
      },
      {
        question: 'Что делать в случае ДТП?',
        answer: {
          text: 'При ДТП:',
          list: ['Включите аварийку', 'Выставьте знак', 'Вызовите ГИБДД (112)', 'Сообщите в поддержку']
        }
      }
    ]
  },
  {
    id: 'support',
    title: 'Поддержка',
    items: [
      {
        question: 'Как связаться с поддержкой?',
        answer: {
          text: 'Поддержка работает 24/7:',
          list: ['Чат в приложении', 'Телефон: 8 800 123-45-67', 'Email: support@carsharing.ru']
        }
      }
    ]
  }
]);

const filteredFaq = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (!query) return faqData.value;
  return faqData.value.map(category => ({
    ...category,
    items: category.items.filter(item => item.question.toLowerCase().includes(query))
  })).filter(category => category.items.length > 0);
});

const toggleItem = (catId, idx) => {
  const key = catId + idx;
  openedItems.value[key] = !openedItems.value[key];
};

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) {
    const yOffset = -120;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

const handleScroll = () => {
  const sections = document.querySelectorAll('.faq-category');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 200 && rect.bottom >= 200) {
      activeCategory.value = section.id;
    }
  });
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>
.faq-page {
    background-color: #000;
    color: #fff;
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}



.faq-hero {
    padding: 160px 0 60px;
    text-align: center;
}

.faq-hero h1 {
    font-size: 56px;
    font-weight: 800;
    margin-bottom: 16px;
    color: #fff;
}

.faq-hero h1 span {
    background: linear-gradient(135deg, #00DC82 0%, #00FF95 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.faq-hero p {
    color: #666;
    font-size: 20px;
    margin-bottom: 40px;
}

.search-box {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 16px;
    background: #0A0A0A;
    border: 1px solid #1A1A1A;
    border-radius: 16px;
    padding: 16px 24px;
    transition: border-color 0.3s;
}

.search-box:focus-within {
    border-color: #00DC82;
}

.search-input {
    background: transparent;
    border: none;
    color: #fff;
    width: 100%;
    outline: none;
    font-size: 16px;
}

/* Layout */
.faq-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 60px;
    padding: 60px 0;
}

.faq-nav {
    position: sticky;
    top: 160px; 
    height: fit-content;
}

.faq-nav h3 {
    font-size: 18px;
    color: #888;
    margin-bottom: 24px;
}

.category-list {
    list-style: none;
    padding: 0;
}

.category-list a {
    display: block;
    padding: 14px 20px;
    color: #CCC;
    text-decoration: none;
    border-radius: 12px;
    transition: 0.3s;
    font-size: 15px;
}

.category-list a.active {
    background: rgba(0, 220, 130, 0.15);
    color: #00DC82;
}

/* FAQ Items */
.faq-category { margin-bottom: 80px; }

.faq-category h2 {
    font-size: 32px;
    margin-bottom: 32px;
    border-bottom: 1px solid #1A1A1A;
    padding-bottom: 16px;
}

.faq-item {
    background: #0A0A0A;
    border: 1px solid #1A1A1A;
    border-radius: 16px;
    margin-bottom: 16px;
    transition: border-color 0.3s;
}

.faq-item.active { border-color: #00DC82; }

.faq-question {
    width: 100%;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    color: #fff;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
}

.faq-question svg {
    color: #666;
    transition: transform 0.3s;
}

.faq-item.active .faq-question svg { transform: rotate(180deg); }

.faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
}

.faq-item.active .faq-answer {
    max-height: 1000px;
}

.answer-content { padding: 0 24px 24px; color: #CCC; line-height: 1.7; }
.answer-content ul { padding-left: 20px; margin-top: 10px; }
.answer-content li { margin-bottom: 8px; }

/* CTA Section */
.help-cta { padding: 100px 0; }

.help-card {
    background: linear-gradient(135deg, rgba(0, 220, 130, 0.1) 0%, rgba(0, 255, 149, 0.1) 100%);
    border: 1px solid rgba(0, 220, 130, 0.2);
    border-radius: 32px;
    padding: 80px;
    text-align: center;
}

.help-card h2 { font-size: 42px; margin-bottom: 16px; }
.help-card p { color: #999; font-size: 18px; margin-bottom: 40px; }

.help-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
}

.btn {
    padding: 16px 32px;
    border-radius: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: 0.3s;
}

.btn-primary { background: #00DC82; color: #000; }
.btn-primary:hover { background: #00ff95; }
.btn-outline { border: 1px solid #1A1A1A; color: #fff; }
.btn-outline:hover { background: #1A1A1A; }

.no-results { text-align: center; color: #666; padding: 40px; }

@media (max-width: 1024px) {
    .faq-layout { grid-template-columns: 1fr; }
    .faq-nav { display: none; }
}
</style>