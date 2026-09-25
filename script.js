// Навигация
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

// Переключение языков
let currentLang = localStorage.getItem('language') || 'ru';

// Функция для установки языка
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Обновляем активную кнопку
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Обновляем все переводимые элементы
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Обновляем плейсхолдеры
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.dataset.i18nPlaceholder;
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Обновляем текст кнопки отправки (для формы)
    const submitButton = document.querySelector('.submit-button');
    if (submitButton && !submitButton.disabled) {
        submitButton.textContent = translations[lang]['form_submit'];
    }
}

// Инициализация языка при загрузке
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
});

// Обработчики кнопок языков
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        setLanguage(lang);
    });
});

// Открытие/закрытие мобильного меню
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Закрытие меню при клике на ссылку
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Изменение навигации при скролле
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Наблюдаем за секциями
const sectionTitles = document.querySelectorAll('.section-title');
const titleUnderlines = document.querySelectorAll('.title-underline');
const serviceCards = document.querySelectorAll('.service-card');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const aboutImage = document.querySelector('.about-image');
const aboutText = document.querySelector('.about-text');
const contactInfo = document.querySelector('.contact-info');
const contactForm = document.querySelector('.contact-form-wrapper');

sectionTitles.forEach(title => observer.observe(title));
titleUnderlines.forEach(underline => observer.observe(underline));
serviceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
});
portfolioItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
});

if (aboutImage) observer.observe(aboutImage);
if (aboutText) observer.observe(aboutText);
if (contactInfo) observer.observe(contactInfo);
if (contactForm) observer.observe(contactForm);

// Плавная прокрутка для всех якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Обработка формы контактов
const contactFormElement = document.getElementById('contactForm');
if (contactFormElement) {
    contactFormElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactFormElement.querySelector('.submit-button');
        const originalButtonText = submitButton.textContent;
        
        // Показываем загрузку
        submitButton.textContent = translations[currentLang]['form_sending'];
        submitButton.disabled = true;
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Отправляем через PHP (если доступен) или напрямую
        let success = false;
        
        // Проверяем доступность PHP
        try {
            const testResponse = await fetch('send-telegram.php', { method: 'HEAD' });
            if (testResponse.ok || testResponse.status === 405) {
                // PHP доступен, используем его
                success = await sendViaPhp(formData);
            } else {
                // PHP недоступен, отправляем напрямую
                success = await sendToTelegram(formData);
            }
        } catch (error) {
            // Ошибка при проверке PHP, пробуем напрямую
            success = await sendToTelegram(formData);
        }

        // Возвращаем кнопку в исходное состояние
        submitButton.textContent = translations[currentLang]['form_submit'];
        submitButton.disabled = false;

        if (success) {
            // Показываем уведомление об успехе
            showNotification(translations[currentLang]['notification_success']);
            // Очищаем форму
            contactFormElement.reset();
        } else {
            // Показываем ошибку
            showNotification(translations[currentLang]['notification_error'], 'error');
        }
    });
}

// Функция отправки через PHP
async function sendViaPhp(data) {
    try {
        console.log('📤 Отправка через PHP...');
        
        const response = await fetch('send-telegram.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        console.log('📥 Ответ от PHP:', result);

        if (result.success) {
            console.log('✅ Сообщение отправлено через PHP');
            return true;
        } else {
            console.error('❌ Ошибка PHP:', result.error);
            if (result.telegram_response) {
                console.error('Telegram ответ:', result.telegram_response);
            }
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка при отправке через PHP:', error);
        return false;
    }
}

// Функция отправки сообщения в Telegram
async function sendToTelegram(data) {
    try {
        // Проверяем наличие конфигурации
        if (!window.TELEGRAM_CONFIG || 
            !window.TELEGRAM_CONFIG.BOT_TOKEN || 
            window.TELEGRAM_CONFIG.BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' ||
            !window.TELEGRAM_CONFIG.CHAT_ID ||
            window.TELEGRAM_CONFIG.CHAT_ID === 'YOUR_CHAT_ID_HERE') {
            console.error('⚠️ Telegram не настроен. Заполните config.js');
            console.log('Данные формы:', data);
            return false;
        }

        const { BOT_TOKEN, CHAT_ID } = window.TELEGRAM_CONFIG;

        console.log('📤 Отправка сообщения в Telegram...');
        console.log('Bot Token:', BOT_TOKEN.substring(0, 20) + '...');
        console.log('Chat ID:', CHAT_ID);

        // Формируем красивое сообщение
        const message = `🎨 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${data.name}
📧 <b>Email:</b> ${data.email}

💬 <b>Сообщение:</b>
${data.message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;

        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        console.log('📍 URL:', telegramUrl);

        // Отправляем запрос к Telegram Bot API
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        console.log('📥 Ответ получен, статус:', response.status);

        const result = await response.json();
        console.log('📋 Результат:', result);

        if (result.ok) {
            console.log('✅ Сообщение успешно отправлено в Telegram');
            return true;
        } else {
            console.error('❌ Ошибка Telegram API:', result);
            
            // Дополнительная информация об ошибке
            if (result.description) {
                console.error('Описание ошибки:', result.description);
                
                if (result.description.includes('chat not found')) {
                    console.error('💡 Решение: Найдите вашего бота в Telegram и нажмите START');
                }
                
                if (result.description.includes('Unauthorized')) {
                    console.error('💡 Решение: Проверьте правильность токена бота');
                }
            }
            
            return false;
        }

    } catch (error) {
        console.error('❌ Ошибка при отправке в Telegram:', error);
        console.error('Детали ошибки:', error.message);
        
        if (error.message.includes('Failed to fetch')) {
            console.error('💡 Возможные причины:');
            console.error('1. Проблемы с интернет соединением');
            console.error('2. Telegram API заблокирован в вашей сети');
            console.error('3. CORS ошибка (если открываете файл локально)');
        }
        
        return false;
    }
}

// Функция показа уведомления
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const bgColor = type === 'success' 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${bgColor};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 4s;
        max-width: 400px;
        font-weight: 500;
        line-height: 1.5;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4500);
}

// Добавляем анимации для уведомления
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Параллакс эффект для героя
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    }
});

// Добавляем курсор эффект (оптимизированный)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorInner = document.createElement('div');
cursorInner.className = 'custom-cursor-inner';
document.body.appendChild(cursorInner);

// Показываем курсор только на десктопах
if (window.innerWidth > 968) {
    cursor.style.display = 'block';
    cursorInner.style.display = 'block';
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let cursorInnerX = 0;
    let cursorInnerY = 0;
    
    // Обновляем позицию мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Анимация курсора с использованием requestAnimationFrame (без лагов)
    function animateCursor() {
        // Плавное следование за курсором (эффект задержки)
        const speed = 0.15;
        const speedInner = 0.3;
        
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursorInnerX += (mouseX - cursorInnerX) * speedInner;
        cursorInnerY += (mouseY - cursorInnerY) * speedInner;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        cursorInner.style.left = cursorInnerX + 'px';
        cursorInner.style.top = cursorInnerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Увеличиваем курсор при наведении на интерактивные элементы
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card, input, textarea');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.border = '2px solid #6C5CE7';
            cursorInner.style.width = '8px';
            cursorInner.style.height = '8px';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.border = '2px solid rgba(108, 92, 231, 0.5)';
            cursorInner.style.width = '6px';
            cursorInner.style.height = '6px';
        });
    });
    
    // Эффект клика
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursorInner.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorInner.style.transform = 'translate(-50%, -50%) scale(1)';
    });
}

// Добавляем счетчик для статистики с анимацией
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 20);
}

// Запускаем анимацию счетчиков при появлении
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.stat-item h4');
            statItems.forEach((item, index) => {
                const values = [4, 100, 50]; // Значения из HTML
                setTimeout(() => {
                    item.textContent = '0+';
                    animateCounter(item, values[index]);
                }, index * 200);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Добавляем эффект печатающегося текста для подзаголовка
const subtitle = document.querySelector('.hero-subtitle');
if (subtitle) {
    const originalText = subtitle.dataset.i18n;
    
    // Функция для анимации печати
    const typeWriterEffect = () => {
        const text = translations[currentLang][originalText] || subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.opacity = '1';
        
        let index = 0;
        const typeWriter = () => {
            if (index < text.length) {
                subtitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1500);
    };
    
    // Запускаем при первой загрузке
    typeWriterEffect();
    
    // Перезапускаем при смене языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(typeWriterEffect, 100);
        });
    });
}

console.log('🎨 Сайт Kreiss загружен успешно!');
