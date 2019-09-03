$(document).ready(function() {

    // Валидация формы и отправка данных
    $("#consult-form").validate({
        submitHandler: function(form) {
            $.ajax({
            url: "mail/send.php",
            type: "POST",
            dataType: "JSON",
            data: new FormData(form),
            processData: false,
            contentType: false,
            success: function (data, status)
            {
                $("#success").fancybox().trigger('click');
                $("#consult-form")[0].reset();
                setTimeout(function() {
                    $.fancybox.close(true);
                }, 3000);
            },
            error: function (xhr, desc, err)
            {
                console.log(desc, err);
            }
        }); 
        return false;
        },
       rules:{         
            name:{
                required: true,
                minlength: 4,
                maxlength: 50,
            },
            phone:{
                minlength: 7,
                maxlength: 30,
                required: true,
            },
            email:{
                email: true,
                required: true,
            }
       },
       messages:{
            name:{
                required: "* это поле обязательно для заполнения",
                minlength: "* имя должно быть минимум 4 символа",
                maxlength: "* максимальное число символо - 50",
            },
            phone:{
                required: "* это поле обязательно для заполнения",
                minlength: "* телефон должен быть минимум 7 цифр",
                maxlength: "* максимальное число цифр - 30",
            },
            email:{
                required: "* это поле обязательно для заполнения",
                email: "* неправильно указан e-mail адрес",
            }
       }
    });

	// Маска ввода телефона в формате +375 (...) ...
    $.mask.definitions['~']='[234]';
    $.mask.definitions['*']='[3459]';
    $("input[name='phone']").mask("+375 (~*) 999-99-99");

	// Модальные окна FancyBox
	// Документация: http://fancybox.net/howto
    // Пример галереи: <a href="image.jpg" class="fancybox" data-fancybox-group="group"><img src="image.jpg" /></a>
	// Пример модального окна: <a href="#success" class="fancybox">Модальное окно</a>
	$(".fancybox").fancybox({
        padding: 0,
        hideScrollbar: false,
        touch: false
    });
    
    // Табы (вкладки)
    $(".tabs").lightTabs();

    // Плавный скролл к элементу
	// Cсылка должна быть вида: href="#id". А элемент, до которого скролить: id="id"
	$("a.top").click(function () {
        var elementClick = $(this).attr("href");
        var destination = $(elementClick).offset().top;
        $('html, body').animate({ scrollTop: destination }, 600);
        return false;
    });

    // Слайдер "Популярные модели дверей"
    let popularSlider = $(".popular-slider");
    popularSlider.owlCarousel({
        nav: false,
        dots: true,
        loop: true,
        touchDrag: true,
        mouseDrag: true,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            }
        }
    });

    $(".popular .btn-prev").click(function() {
        popularSlider.trigger('prev.owl.carousel');
    });

    $(".popular .btn-next").click(function() {
        popularSlider.trigger('next.owl.carousel');
    });

    // Кнопка "Наверх"
	$(window).scroll(function(){
        if ($(this).scrollTop() > 500){
            $('#top').fadeIn();
        } else {$('#top').fadeOut();}
    });
    $("#top").click(function () {
        $("body, html").animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    // Запуск скрипта для анимации Animate.css
    // Документация по animate.css https://daneden.github.io/animate.css
    // Документация по Wow.js https://mynameismatthieu.com/WOW/docs.html
    new WOW().init();
});