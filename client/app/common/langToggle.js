var setActive = function(lang) {
    lang = lang ? lang : TAPi18n.getLanguage();

    $('.lang').removeClass('active');
    $('.js-lang-' + lang).addClass('active');
};

var setLang = function(lang) {
    TAPi18n.setLanguage(lang);
    setActive(lang);
};

Template.langToggle.rendered = function(){
    setLang('ru');

    $('.js-lang-en a').on('click', function (){
        setLang('en');
    });

    $('.js-lang-ru a').on('click', function (){
        setLang('ru');
    });
};