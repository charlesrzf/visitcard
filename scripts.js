/*
 * Cartão digital · Charles Rezende Freitas · GE21 Geotecnologias
 * - Interface multilíngue (pt / en / es / zh / ar) — detecção automática
 *   pelo idioma do navegador + seletor manual (memorizado em localStorage)
 * - Árabe em RTL (direita para a esquerda)
 * - Download do vCard
 * - Expandir/recolher escritórios
 * - Botão compartilhar (Web Share API, com fallback de copiar link)
 */
(function () {
    'use strict';

    const I18N = {
        pt: { role: 'CEO e Cofundador',            save: 'Salvar contato',   email: 'E-mail', call: 'Ligar',   site: 'Site',          offices: 'Escritórios', share: 'Compartilhar cartão', copied: 'Link copiado!',       lang: 'pt-BR', dir: 'ltr' },
        en: { role: 'CEO & Co-Founder',            save: 'Save contact',     email: 'Email',  call: 'Call',    site: 'Website',       offices: 'Offices',     share: 'Share card',         copied: 'Link copied!',        lang: 'en',    dir: 'ltr' },
        es: { role: 'CEO y Cofundador',            save: 'Guardar contacto', email: 'Correo', call: 'Llamar',  site: 'Sitio web',     offices: 'Oficinas',    share: 'Compartir tarjeta',  copied: '¡Enlace copiado!',    lang: 'es',    dir: 'ltr' },
        zh: { role: '首席执行官兼联合创始人',        save: '保存联系人',        email: '邮箱',   call: '致电',    site: '网站',          offices: '办公室',       share: '分享名片',            copied: '链接已复制！',         lang: 'zh',    dir: 'ltr' },
        ar: { role: 'الرئيس التنفيذي والشريك المؤسس', save: 'حفظ جهة الاتصال', email: 'البريد الإلكتروني', call: 'اتصال', site: 'الموقع الإلكتروني', offices: 'المكاتب', share: 'مشاركة البطاقة', copied: 'تم نسخ الرابط!', lang: 'ar', dir: 'rtl' }
    };

    const STORE_KEY = 'visitcard-lang';

    function detectLang() {
        let saved = null;
        try { saved = localStorage.getItem(STORE_KEY); } catch (_) {}
        if (saved && I18N[saved]) return saved;
        const nav = (navigator.language || 'pt').toLowerCase().slice(0, 2);
        return I18N[nav] ? nav : 'en';
    }

    function apply(code) {
        const dict = I18N[code] || I18N.en;

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) el.textContent = dict[key];
        });

        document.documentElement.setAttribute('lang', dict.lang);
        document.documentElement.setAttribute('dir', dict.dir);

        const share = document.getElementById('share');
        if (share) share.setAttribute('aria-label', dict.share);

        const email = document.querySelector('.quick-item[href^="mailto"]');
        if (email) email.setAttribute('aria-label', dict.email);
        const call = document.querySelector('.quick-item[href^="tel"]');
        if (call) call.setAttribute('aria-label', dict.call);

        document.querySelectorAll('#lang button').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-lang') === code);
        });

        window.__lang = code;
    }

    document.addEventListener('DOMContentLoaded', function () {
        let current = detectLang();
        apply(current);

        /* ---- Seletor de idioma ---- */
        document.querySelectorAll('#lang button').forEach(function (b) {
            b.addEventListener('click', function () {
                current = b.getAttribute('data-lang');
                try { localStorage.setItem(STORE_KEY, current); } catch (_) {}
                apply(current);
            });
        });

        /* ---- vCard ---- */
        const save = document.getElementById('save-contact');
        if (save) {
            save.addEventListener('click', function (e) {
                e.preventDefault();
                const vcfUrl = 'https://charlesrzf.github.io/card/charlesrf.vcf';
                const temp = document.createElement('a');
                temp.href = vcfUrl;
                temp.download = 'charlesrf.vcf';
                document.body.appendChild(temp);
                temp.click();
                document.body.removeChild(temp);
            });
        }

        /* ---- Escritórios (expandir) ---- */
        const toggle = document.getElementById('office-toggle');
        if (toggle) {
            const office = toggle.closest('.office');
            toggle.addEventListener('click', function () {
                const open = office.classList.toggle('open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }

        /* ---- Compartilhar ---- */
        const share = document.getElementById('share');
        if (share) {
            share.addEventListener('click', async function () {
                const url = window.location.href;
                try {
                    if (navigator.share) {
                        await navigator.share({ title: 'Charles Rezende Freitas — GE21', url: url });
                        return;
                    }
                } catch (_) { return; /* usuário cancelou */ }

                try {
                    await navigator.clipboard.writeText(url);
                    const dict = I18N[window.__lang] || I18N.en;
                    const original = share.innerHTML;
                    share.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
                    share.setAttribute('title', dict.copied);
                    setTimeout(function () {
                        share.innerHTML = original;
                        share.removeAttribute('title');
                    }, 1600);
                } catch (_) {}
            });
        }
    });
})();
