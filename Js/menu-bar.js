console.log("menu-bar.js loaded");

$(document).ready(function(){
    console.log("jQuery ready");
    
    // Проверяем, найден ли элемент .bars
    console.log("Bars elements found:", $('.bars').length);
    console.log("Nav elements found:", $('.nav').length);
    
    $('.bars').on('click', function(e){
        e.stopPropagation(); // Предотвращаем всплытие события
        e.preventDefault(); // Предотвращаем стандартное поведение
        console.log("Bars clicked - working!");
        console.log("Current nav display:", $('.nav').css('display'));
        $('.nav').toggleClass('active').slideToggle(150, function() {
            console.log("Animation complete. New display:", $(this).css('display'));
        });
    });

    // Закрытие меню при клике вне его
    $(document).on('click', function(e) {
        // Не закрываем меню, если клик был на .bars, внутри .bars (иконка), или внутри .topnav
        const isClickOnBars = $(e.target).closest('.bars').length > 0;
        const isClickOnTopnav = $(e.target).closest('.topnav').length > 0;
        
        if (!isClickOnTopnav && !isClickOnBars) {
            if ($(window).width() <= 768) {
                $('.nav').removeClass('active').slideUp(150);
            }
        }
    });

    // Закрытие меню при клике на ссылку (на мобильных устройствах)
    $('.nav__link').on('click', function() {
        if ($(window).width() <= 768) {
            $('.nav').removeClass('active').slideUp(150);
        }
    });

    // Обработчик клика на логотип - возврат на главную страницу
    $('#logoLink').on('click', function(e) {
        e.preventDefault();
        const currentPath = window.location.pathname;
        const currentHref = window.location.href;
        const isMainPage = currentPath.includes('index.html') || 
                         currentPath.endsWith('/') || 
                         currentPath.endsWith('\\') ||
                         currentHref.includes('index.html') ||
                         !currentPath.includes('About.html');
        
        if (isMainPage) {
            // Если мы на главной странице, просто прокручиваем наверх
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        } else {
            // Определяем правильный путь к главной странице
            let mainPagePath = 'index.html';
            if (currentPath.includes('parts') || currentPath.includes('О нас')) {
                mainPagePath = '../../index.html';
            } else if (currentPath.includes('/')) {
                mainPagePath = '../index.html';
            }
            window.location.href = mainPagePath;
        }
    });
});