document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherQuestion) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                }
            });
            
            // Переключаем текущий элемент
            if (isActive) {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                // Устанавливаем точную высоту для плавной анимации
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
        
        // Обработка изменения размера окна для корректной работы анимации
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                faqItems.forEach(activeItem => {
                    if (activeItem.classList.contains('active')) {
                        const activeAnswer = activeItem.querySelector('.faq-answer');
                        if (activeAnswer) {
                            activeAnswer.style.maxHeight = activeAnswer.scrollHeight + 'px';
                        }
                    }
                });
            }, 250);
        });
    });
    
    // Поддержка клавиатуры
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });
});

