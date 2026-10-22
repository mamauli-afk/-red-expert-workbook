(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    const root = sidebar.dataset.navRoot || '';
    const current = location.pathname.split('/').pop() || 'index.html';

    const sections = [
      { title: 'Главная', items: [
        { href: 'index.html', label: 'Навигатор' },
        { href: 'pages/instruction.html', label: 'Как работать с тетрадью' }
      ]},

      { title: 'Модули', items: [
        { href: 'pages/module1.html', label: '1. Red Expert' },
        { href: 'pages/module2.html', label: '2. Интеграция БД' },
        { href: 'pages/module3.html', label: '3. Авторизация и CRUD' },
        { href: 'pages/module4.html', label: '4. Отчёты и печать' },
        // Обернуто в <strong> для жирного начертания
        { href: 'pages/control.html', label: '<strong>Контрольный модуль</strong>' } 
      ]},
      { title: 'Приложения', items: [
        { href: 'pages/appendices/appendix-a.html', label: 'А. Глоссарий' },
        { href: 'pages/appendices/appendix-b.html', label: 'Б. SQL и C#' },
        { href: 'pages/appendices/appendix-c.html', label: 'В. Окружение' },
        { href: 'pages/appendices/appendix-d.html', label: 'Г. Примеры кода' },
        { href: 'pages/appendices/appendix-e.html', label: 'Д. Литература' },
        { href: 'pages/appendices/appendix-f.html', label: 'Е. Критерии' }
      ]}
    ];

    let html = '';
    sections.forEach(section => {
      html += '<div class="sidebar__section">';
      html += '<div class="sidebar__heading">' + section.title + '</div>';
      html += '<ul class="sidebar__nav">';
      section.items.forEach(item => {
        const file = item.href.split('/').pop();
        const active = (file === current) ? ' sidebar__link--active' : '';
        html += '<li><a class="sidebar__link' + active + '" href="' + root + item.href + '">' + item.label + '</a></li>';
      });
      html += '</ul></div>';
    });
    
    sidebar.innerHTML = html;

    const pct = document.getElementById('progressValue');
    if (pct) pct.textContent = Storage.getPercent(20) + '%';
  });
})();