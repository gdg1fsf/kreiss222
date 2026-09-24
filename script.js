// Навигация
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

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
        submitButton.textContent = 'Отправка...';
        submitButton.disabled = true;
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Отправляем в Telegram
        const success = await sendToTelegram(formData);

        // Возвращаем кнопку в исходное состояние
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;

        if (success) {
            // Показываем уведомление об успехе
            showNotification('Спасибо! Ваше сообщение отправлено. Свяжусь с вами в ближайшее время!');
            // Очищаем форму
            contactFormElement.reset();
        } else {
            // Показываем ошибку
            showNotification('Произошла ошибка. Попробуйте написать напрямую в Telegram: @krelss', 'error');
        }
    });
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
            console.warn('⚠️ Telegram не настроен. Заполните config.js');
            console.log('Данные формы:', data);
            return false;
        }

        const { BOT_TOKEN, CHAT_ID } = window.TELEGRAM_CONFIG;

        // Формируем красивое сообщение
        const message = `
🎨 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${data.name}
📧 <b>Email:</b> ${data.email}

💬 <b>Сообщение:</b>
${data.message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
        `.trim();

        // Отправляем запрос к Telegram Bot API
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
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

        const result = await response.json();

        if (result.ok) {
            console.log('✅ Сообщение успешно отправлено в Telegram');
            return true;
        } else {
            console.error('❌ Ошибка Telegram API:', result);
            return false;
        }

    } catch (error) {
        console.error('❌ Ошибка при отправке в Telegram:', error);
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

// Добавляем курсор эффект
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid #6C5CE7;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: all 0.15s ease;
    transform: translate(-50%, -50%);
    display: none;
`;
document.body.appendChild(cursor);

// Показываем курсор только на десктопах
if (window.innerWidth > 968) {
    cursor.style.display = 'block';
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Увеличиваем курсор при наведении на интерактивные элементы
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(108, 92, 231, 0.1)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'transparent';
        });
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
    const text = subtitle.textContent;
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
}

console.log('🎨 Сайт Kreiss загружен успешно!');
