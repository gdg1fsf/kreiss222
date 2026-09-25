# 📸 Как добавить изображения портфолио

## 📁 Куда скинуть фотографии?

Создана папка для ваших изображений:
```
📁 images/
  └── 📁 portfolio/
      ├── project1.jpg  ← Сюда добавьте ваши работы
      ├── project2.jpg
      ├── project3.jpg
      └── ...
```

## 🎯 Инструкция по добавлению изображений:

### Шаг 1: Подготовьте изображения
1. Скопируйте 6 изображений ваших лучших работ
2. Переименуйте их понятными названиями, например:
   - `web-design-startup.jpg`
   - `telegram-banner.jpg`
   - `instagram-branding.jpg`
   - `corporate-website.jpg`
   - `vk-banners.jpg`
   - `blogger-branding.jpg`

3. Рекомендуемый размер изображений: **1200x750px** (соотношение 16:10)
4. Формат: **JPG** или **PNG**
5. Оптимизируйте размер файла (желательно до 200-500 KB)

### Шаг 2: Скопируйте файлы
Скопируйте ваши изображения в папку:
```
C:\Users\twork\Desktop\site kreisss\images\portfolio\
```

### Шаг 3: Обновите HTML
Откройте файл `index.html` и найдите секцию Portfolio (примерно строка 122).

Замените блоки с цветными плейсхолдерами на изображения:

**БЫЛО:**
```html
<div class="portfolio-item">
    <div class="portfolio-image">
        <div class="portfolio-placeholder" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
    </div>
    <div class="portfolio-overlay">
        <h3 data-i18n="portfolio_1_title">Веб-дизайн проект</h3>
        <p data-i18n="portfolio_1_desc">Landing page для стартапа</p>
    </div>
</div>
```

**СТАЛО:**
```html
<div class="portfolio-item">
    <div class="portfolio-image">
        <img src="images/portfolio/web-design-startup.jpg" alt="Веб-дизайн проект">
    </div>
    <div class="portfolio-overlay">
        <h3 data-i18n="portfolio_1_title">Веб-дизайн проект</h3>
        <p data-i18n="portfolio_1_desc">Landing page для стартапа</p>
    </div>
</div>
```

### Шаг 4: Примените для всех 6 изображений

Замените все 6 блоков `.portfolio-placeholder` на теги `<img>`:

```html
<!-- Проект 1 -->
<img src="images/portfolio/web-design-startup.jpg" alt="Веб-дизайн">

<!-- Проект 2 -->
<img src="images/portfolio/telegram-banner.jpg" alt="Telegram баннер">

<!-- Проект 3 -->
<img src="images/portfolio/instagram-branding.jpg" alt="Instagram оформление">

<!-- Проект 4 -->
<img src="images/portfolio/corporate-website.jpg" alt="Корпоративный сайт">

<!-- Проект 5 -->
<img src="images/portfolio/vk-banners.jpg" alt="VK баннеры">

<!-- Проект 6 -->
<img src="images/portfolio/blogger-branding.jpg" alt="Брендинг">
```

## 🎨 Добавьте стили для изображений

Откройте `styles.css` и найдите секцию `.portfolio-image` (примерно строка 670).

Добавьте эти стили:

```css
.portfolio-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: var(--transition);
}

.portfolio-item:hover .portfolio-image img {
    transform: scale(1.1);
}
```

## ✅ Готово!

Теперь при открытии сайта вы увидите реальные изображения ваших работ вместо цветных плейсхолдеров!

## 💡 Дополнительные советы:

### Оптимизация изображений
Используйте онлайн-сервисы для сжатия:
- https://tinypng.com/
- https://squoosh.app/
- https://compressor.io/

### Добавление больше проектов
Если хотите добавить больше 6 работ:

1. Скопируйте блок `.portfolio-item` в HTML
2. Обновите путь к изображению
3. Обновите заголовок и описание
4. Добавьте ключи перевода в `translations.js`

### Адаптивность
Изображения автоматически адаптируются под мобильные устройства благодаря `object-fit: cover`.

---

## 🔧 Быстрая замена (копируйте целиком в index.html)

Найдите секцию `<div class="portfolio-grid">` и замените на:

```html
<div class="portfolio-grid">
    <!-- Проект 1 -->
    <div class="portfolio-item">
        <div class="portfolio-image">
            <img src="images/portfolio/project1.jpg" alt="Проект 1">
        </div>
        <div class="portfolio-overlay">
            <h3 data-i18n="portfolio_1_title">Веб-дизайн проект</h3>
            <p data-i18n="portfolio_1_desc">Landing page для стартапа</p>
        </div>
    </div>
    
    <!-- Проект 2 -->
    <div class="portfolio-item">
        <div class="portfolio-image">
            <img src="images/portfolio/project2.jpg" alt="Проект 2">
        </div>
        <div class="portfolio-overlay">
            <h3 data-i18n="portfolio_2_title">Telegram баннер</h3>
            <p data-i18n="portfolio_2_desc">Дизайн для бизнес канала</p>
        </div>
    </div>
    
    <!-- Проект 3 -->
    <div class="portfolio-item">
        <div class="portfolio-image">
            <img src="images/portfolio/project3.jpg" alt="Проект 3">
        </div>
        <div class="portfolio-overlay">
            <h3 data-i18n="portfolio_3_title">Соц. сети</h3>
            <p data-i18n="portfolio_3_desc">Комплексное оформление Instagram</p>
        </div>
    </div>
    
    <!-- Проект 4 -->
    <div class="portfolio-item">
        <div class="portfolio-image">
            <img src="images/portfolio/project4.jpg" alt="Проект 4">
        </div>
        <div class="portfolio-overlay">
            <h3 data-i18n="portfolio_4_title">Корпоративный сайт</h3>
            <p data-i18n="portfolio_4_desc">Дизайн для IT компании</p>
        </div>
    </div>
    
    <!-- Проект 5 -->
    <div class="portfolio-item">
        <div class="portfolio-image">
            <img src="images/portfolio/project5.jpg" alt="Проект 5">
        </div>
        <div class="portfolio-overlay">
            <h3 data-i18n="portfolio_5_title">Баннеры VK</h3>
            <p data-i18n="portfolio_5_desc">Серия баннеров для сообщества</p>
        </div>
    </div>
    
    <!-- Проект 6 -->
    <div class="portfolio-item">
        <div class="portfolio-image">
            <img src="images/portfolio/project6.jpg" alt="Проект 6">
        </div>
        <div class="portfolio-overlay">
            <h3 data-i18n="portfolio_6_title">Брендинг</h3>
            <p data-i18n="portfolio_6_desc">Фирменный стиль для блогера</p>
        </div>
    </div>
</div>
```

Не забудьте переименовать `project1.jpg`, `project2.jpg` и т.д. на реальные названия ваших файлов!
