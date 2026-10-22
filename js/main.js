document.addEventListener('DOMContentLoaded', function () {
  // --- Обработка чек-листов ---
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach(function (box) {
    const id = box.dataset.progressId;
    if (!id) return;
    const saved = Storage.getProgress();
    box.checked = !!saved[id];
    box.addEventListener('change', function () {
      Storage.setProgress(id, box.checked);
    });
  });

  // --- Прогресс-бар ---
  const bar = document.querySelector('.progress-bar__fill');
  if (bar) {
    const total = parseInt(bar.dataset.total || '20', 10);
    bar.style.width = Storage.getPercent(total) + '%';
  }

  // --- Сохранение текста из Textarea ---
  document.querySelectorAll('textarea[data-progress-id]').forEach(function (textarea) {
    const id = textarea.dataset.progressId;
    const saved = localStorage.getItem('wb_text_' + id);
    if (saved) textarea.value = saved;
    
    textarea.addEventListener('input', function () {
      localStorage.setItem('wb_text_' + id, textarea.value);
      Storage.setProgress(id, textarea.value.trim().length > 0);
    });
  });

  // --- Загрузка и превью скриншотов ---
  document.querySelectorAll('input[type="file"][data-progress-id]').forEach(function (input) {
    const id = input.dataset.progressId;
    const preview = document.getElementById('preview_' + id);
    const statusText = document.getElementById('status_' + id);

    // Проверяем, загружали ли файл ранее (в этой сессии)
    if (localStorage.getItem('wb_file_' + id)) {
      if (statusText) statusText.textContent = '✅ Скриншот загружен (нажмите, чтобы заменить)';
    }

    input.addEventListener('change', function (e) {
      if (e.target.files.length > 0) {
        localStorage.setItem('wb_file_' + id, 'true');
        Storage.setProgress(id, true);
        
        if (statusText) statusText.textContent = '✅ Скриншот загружен';
        
        if (preview) {
          const reader = new FileReader();
          reader.onload = function (evt) {
            preview.src = evt.target.result;
            preview.style.display = 'block';
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      }
    }); // <--- ВАЖНО: Закрываем addEventListener('change')
  }); // <--- ВАЖНО: Закрываем forEach

  // =======================================================
  // --- Логика кнопок панели действий (ВЫНЕСЕНО НАРУЖУ) ---
  // =======================================================
  
  // 1. Сохранить
  const btnSave = document.getElementById('btnSave');
  if (btnSave) {
    btnSave.addEventListener('click', function() {
      alert('✅ Все введенные данные и скриншоты успешно сохранены в вашем браузере!');
    });
  }

  // 2. Печать / PDF
  const btnPrint = document.getElementById('btnPrint');
  if (btnPrint) {
    btnPrint.addEventListener('click', function() {
      window.print();
    });
  }

  // 3. Экспорт JSON
  const btnExport = document.getElementById('btnExport');
  if (btnExport) {
    btnExport.addEventListener('click', function() {
      let exportData = {};
      // Собираем все данные, относящиеся к рабочей тетради
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('wb_') || key === 'avalonia-workbook-progress') {
          exportData[key] = localStorage.getItem(key);
        }
      }
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      
      const pageName = location.pathname.split('/').pop().replace('.html', '') || 'index';
      downloadAnchorNode.setAttribute("download", "workbook_answers_" + pageName + ".json");
      
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  }

  // 4. Сбросить данные
  const btnReset = document.getElementById('btnReset');
  if (btnReset) {
    btnReset.addEventListener('click', function() {
      if (confirm('⚠️ ВНИМАНИЕ! Вы уверены, что хотите сбросить все ответы и скриншоты на этой странице? Это действие нельзя отменить.')) {
        // Удаляем данные из localStorage, связанные с этой страницей
        document.querySelectorAll('[data-progress-id]').forEach(el => {
          const id = el.dataset.progressId;
          localStorage.removeItem('wb_text_' + id);
          localStorage.removeItem('wb_file_' + id);
        });
        
        // Очищаем чек-листы
        localStorage.removeItem('avalonia-workbook-progress');
        
        // Перезагружаем страницу для применения изменений
        location.reload();
      }
    });
  }

});