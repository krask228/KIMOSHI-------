console.log("menu-bar.js loaded");

$(document).ready(function(){
    console.log("jQuery ready");
    
    // Проверяем, найден ли элемент .bars
    console.log("Bars elements found:", $('.bars').length);
    console.log("Nav elements found:", $('.nav').length);
    
    $('.bars').on('click', function(){
        console.log("Bars clicked - working!");
        console.log("Current nav display:", $('.nav').css('display'));
        $('.nav').toggleClass('active').slideToggle(150, function() {
            console.log("Animation complete. New display:", $(this).css('display'));
        });
    });

    // Закрытие меню при клике вне его
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.topnav').length) {
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
        // Прокручиваем страницу наверх с плавной анимацией
        $('html, body').animate({
            scrollTop: 0
        }, 500);
        
        // Если страница не главная, можно добавить переход на главную
        // window.location.href = './index.html';
    });
});