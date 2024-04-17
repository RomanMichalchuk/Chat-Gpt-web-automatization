// ==UserScript==
// @name         Web chat GPT automatization
// @namespace    https://t.me/seo_drift
// @version      2.0
// @description  Добавляет функционал для построчной генерации и сохранения этих строк в html формате
// @author       https://t.me/seo_drift by @seo_pro
// @match        https://chat.openai.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var ArticlePlan = {
        init: function() {
            if (!this.textarea) {
                this.createTextarea();
                this.articleContent = '';
            } else {
                this.textarea.style.display = this.textarea.style.display === 'none' ? 'block' : 'none';
            }
        },

        createTextarea: function() {
            this.textarea = document.createElement('textarea');
            this.textarea.style.position = 'fixed';
            this.textarea.style.bottom = '150px';
            this.textarea.style.right = '20px';
            this.textarea.style.width = '300px';
            this.textarea.style.height = '200px';
            document.body.appendChild(this.textarea);
        },

        executePlan: function() {
    if (!this.lines || this.lines.length === 0) {
        this.lines = this.textarea.value.split('\n').filter(line => line.trim() !== '');
    }

    if (this.lines.length > 0) {
        const line = this.lines.shift();
        this.textarea.value = this.lines.join('\n');
        executeChatCommand(line, this.checkForCompletion.bind(this));
    } else {
        this.saveButton.style.display = 'block';
    }
},

        checkForCompletion: function() {
            if (this.lines.length > 0) {
                setTimeout(() => {
                    this.executePlan();
                }, 1000); // Добавляем задержку перед отправкой следующей строки
            } else {
                this.saveButton.style.display = 'block';
            }
        },

        copyChatContent: function() {
            const chatContents = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');
            let newContent = "";
            chatContents.forEach(content => {
                newContent += content.innerHTML + "<br>"; // Разделитель диалогов - можно убрать вообще или изменить
            });

            if (this.articleContent.trim() !== newContent.trim()) {
                this.articleContent = newContent;
            }
        },

        saveArticleContent: function() {
            this.copyChatContent(); // Update the article content before saving
            if (!this.articleContent.trim()) {
                alert("Статья пуста. Нет содержимого для сохранения.");
                return;
            }
            const blob = new Blob([this.articleContent], {type: 'text/html'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'article.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
    };

    // Изменения в executeChatCommand для учета доступности кнопки отправки
function executeChatCommand(text, callback) {
    const inputSelector = document.querySelector('input[type="text"], textarea');
    if (!inputSelector) {
        console.error("Input element not found.");
        return;
    }

    inputSelector.value = text;
    inputSelector.dispatchEvent(new Event('input', { bubbles: true }));

    const sendButton = document.querySelector('button[data-testid="send-button"]');
    if (sendButton && !sendButton.disabled) {
        sendButton.click();
        if (callback) {
            callback(); // Вызываем функцию обратного вызова сразу после отправки сообщения
        }
    } else {
        setTimeout(() => {
            executeChatCommand(text, callback); // Повторно вызываем функцию, если кнопка отправки недоступна
        }, 500);
    }

    // Добавляем задержку перед следующей отправкой сообщения
    setTimeout(() => {
        if (this.lines.length > 0) {
            this.executePlan();
        }
    }, 1000);
}


    function addCustomUI() {
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.bottom = '47px';
        menu.style.right = '20px';
        menu.style.padding = '10px';
        menu.style.background = 'white';
        menu.style.border = '1px solid black';
        menu.style.zIndex = '10000';
        document.body.appendChild(menu);

        const addButton = document.createElement('button');
        addButton.textContent = 'Добавить план';
        addButton.style.display = 'block';
        addButton.style.marginBottom = '5px';
        addButton.onclick = () => ArticlePlan.init();
        menu.appendChild(addButton);

        const executeButton = document.createElement('button');
        executeButton.textContent = 'Выполнить план';
        executeButton.style.display = 'block';
        executeButton.style.marginBottom = '5px';
        executeButton.onclick = () => ArticlePlan.executePlan();
        menu.appendChild(executeButton);

        // Moved the creation of the save button here to ensure it's below the execute plan button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Сохранить статью';
        saveButton.style.display = 'none'; // Initially hidden
        saveButton.onclick = () => ArticlePlan.saveArticleContent();
        menu.appendChild(saveButton);
        ArticlePlan.saveButton = saveButton; // Assign to the global object for later access

        const adminLink = document.createElement('a');
        adminLink.href = 'https://t.me/+G1jLhsXiHNk3MDQy'; // Здесь можно вставить реальную ссылку
        adminLink.textContent = 'by @seo_drift';
        adminLink.style.position = 'fixed';
        adminLink.style.bottom = '15px'; // Начальное положение
        adminLink.style.right = '20px';
        adminLink.style.color = 'blue'; // Синий цвет текста, как у ссылок
        adminLink.style.textDecoration = 'underline'; // Подчеркивание, как у ссылок
        adminLink.style.zIndex = '10001';
        document.body.appendChild(adminLink);

        // Функция для обновления позиции ссылки
        const updateAdminLinkPosition = (isSaveVisible) => {
            const yOffset = isSaveVisible ? '25px' : '25px'; // Поднимаем или опускаем на 30px
            adminLink.style.bottom = yOffset;
        };

        // Переменная для хранения состояния кнопки "Сохранить статью"
        let saveButtonVisible = false;

        // Переопределение методов объекта ArticlePlan для вызова updateAdminLinkPosition
        const originalExecutePlan = ArticlePlan.executePlan.bind(ArticlePlan);
        ArticlePlan.executePlan = function() {
            originalExecutePlan();
            saveButtonVisible = this.saveButton.style.display !== 'none';
            updateAdminLinkPosition(saveButtonVisible);
        };

        const originalSaveArticleContent = ArticlePlan.saveArticleContent.bind(ArticlePlan);
        ArticlePlan.saveArticleContent = function() {
            originalSaveArticleContent();
            saveButtonVisible = this.saveButton.style.display !== 'none';
            updateAdminLinkPosition(saveButtonVisible);
        };

        // Устанавливаем начальное положение ссылки
        updateAdminLinkPosition(saveButtonVisible);
    }

    addCustomUI();
})();
