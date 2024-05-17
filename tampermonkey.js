// ==UserScript==
// @name         Web chat GPT automatization
// @namespace    https://t.me/seo_drift
// @version      3.1
// @description  Добавляет функционал для построчной генерации и сохранения этих строк в html формате
// @author       https://t.me/seo_drift by @seo_pro
// @match        https://chatgpt.com/*
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
                console.log(`Sending line: ${line}`);
                executeChatCommand(line, this.checkForCompletion.bind(this));
            } else {
                this.saveButton.style.display = 'block';
            }
        },

        checkForCompletion: function() {
            const chatContentSelector = '.mt-1.flex.gap-3.empty\\:hidden.juice\\:-ml-3';
            const chatContent = document.querySelector(chatContentSelector);

            if (chatContent) {
                setTimeout(() => {
                    this.copyChatContent();
                    this.executePlan();
                }, 2000); // Увеличиваем задержку перед отправкой следующей строки
            } else {
                setTimeout(() => {
                    this.checkForCompletion();
                }, 1000); // Увеличиваем задержку для проверки наличия ответа
            }
        },

        copyChatContent: function() {
            const chatContents = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.light');
            let newContent = "";
            chatContents.forEach(content => {
                newContent += content.innerHTML + "<br>";
            });

            if (this.articleContent.trim() !== newContent.trim()) {
                this.articleContent = newContent;
            }
        },

        saveArticleContent: function() {
            this.copyChatContent();
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

    function executeChatCommand(text, callback) {
        const inputSelector = document.querySelector('#prompt-textarea');
        if (!inputSelector) {
            console.error("Input element not found.");
            return;
        }

        inputSelector.value = text;
        inputSelector.dispatchEvent(new Event('input', { bubbles: true }));

        const sendButton = document.querySelector('button.mb-1.mr-1.flex.h-8.w-8.items-center.justify-center.rounded-full.bg-black.text-white.transition-colors.hover\\:opacity-70.focus-visible\\:outline-none.focus-visible\\:outline-black');
        if (sendButton && !sendButton.disabled) {
            sendButton.click();
            if (callback) {
                setTimeout(() => {
                    callback();
                }, 1500); // Увеличиваем задержку после отправки сообщения
            }
        } else {
            console.error("Send button not found or is disabled.");
            setTimeout(() => {
                executeChatCommand(text, callback);
            }, 1000); // Увеличиваем задержку перед повторной попыткой отправки сообщения
        }
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

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Сохранить статью';
        saveButton.style.display = 'none';
        saveButton.onclick = () => ArticlePlan.saveArticleContent();
        menu.appendChild(saveButton);
        ArticlePlan.saveButton = saveButton;

        const adminLink = document.createElement('a');
        adminLink.href = 'https://t.me/+G1jLhsXiHNk3MDQy';
        adminLink.textContent = 'by @seo_drift';
        adminLink.style.position = 'fixed';
        adminLink.style.bottom = '15px';
        adminLink.style.right = '20px';
        adminLink.style.color = 'blue';
        adminLink.style.textDecoration = 'underline';
        adminLink.style.zIndex = '10001';
        document.body.appendChild(adminLink);

        const updateAdminLinkPosition = (isSaveVisible) => {
            const yOffset = isSaveVisible ? '25px' : '25px';
            adminLink.style.bottom = yOffset;
        };

        let saveButtonVisible = false;

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

        updateAdminLinkPosition(saveButtonVisible);
    }

    addCustomUI();
})();
