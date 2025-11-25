console.log("menu-bar.js loaded");

$(document).ready(function(){
    console.log("jQuery ready");
    
    // Проверяем, найден ли элемент .bars
    console.log("Bars elements found:", $('.bars').length);
    console.log("Nav elements found:", $('.nav').length);
    
    let menuJustToggled = false; // Флаг для отслеживания недавнего переключения меню
    
    $('.bars').on('click', function(e){
        e.stopPropagation(); // Предотвращаем всплытие события
        e.preventDefault(); // Предотвращаем стандартное поведение
        console.log("Bars clicked - working!");
        console.log("Current nav display:", $('.nav').css('display'));
        
        // Устанавливаем флаг, что меню только что переключилось
        menuJustToggled = true;
        
        // Сбрасываем флаг через достаточное время после клика
        setTimeout(function() {
            menuJustToggled = false;
        }, 300);
        
        $('.nav').toggleClass('active').slideToggle(150, function() {
            console.log("Animation complete. New display:", $(this).css('display'));
        });
    });

    // Закрытие меню при клике вне его (с задержкой для предотвращения конфликта с toggle)
    let closeMenuTimeout;
    $(document).on('click', function(e) {
        // Очищаем предыдущий таймер
        clearTimeout(closeMenuTimeout);
        
        // Не закрываем меню, если оно только что переключилось
        if (menuJustToggled) {
            return; // Игнорируем клик, если меню только что переключилось
        }
        
        const isClickOnBars = $(e.target).closest('.bars').length > 0;
        const isClickOnTopnav = $(e.target).closest('.topnav').length > 0;
        const isNavVisible = $('.nav').hasClass('active') || $('.nav').is(':visible');
        
        // Закрываем меню только если оно видимо и клик был вне меню (с небольшой задержкой)
        if (!isClickOnTopnav && !isClickOnBars && isNavVisible) {
            if ($(window).width() <= 768) {
                closeMenuTimeout = setTimeout(function() {
                    $('.nav').removeClass('active').slideUp(150);
                }, 10);
            }
        }
    });

    // Закрытие меню при клике на ссылку (на мобильных устройствах)
    $('.nav__link').on('click', function() {
        if ($(window).width() <= 768) {
            $('.nav').removeClass('active').slideUp(150);
        }
    });

    // Обработчик клика на логотип - переход или прокрутка к началу
    $('#logoLink').on('click', function(e) {
        const target = e.currentTarget;
        const homeUrl = target.dataset.home || target.getAttribute('href') || './index.html';
        const absoluteHomeUrl = new URL(homeUrl, window.location.origin).pathname.replace(/\/+$/, '');
        const currentPath = window.location.pathname.replace(/\/+$/, '');

        if (currentPath === absoluteHomeUrl || currentPath === '') {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        } else {
            target.setAttribute('href', homeUrl);
        }
    });
});