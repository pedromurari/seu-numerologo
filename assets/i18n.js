/* Seu Numerólogo — i18n runtime (pt/en/es)
   Loads /locales/{lang}.json based on cookie sn_lang (set by middleware.js from IP geolocation,
   or by the manual language switcher), applies to every [data-i18n] element, and exposes
   window.I18N / window.I18N_READY so page-specific scripts can populate their own dictionaries. */
(function (window, document) {
  'use strict';

  var SUPPORTED = ['pt', 'en', 'es'];
  var DEFAULT_LANG = 'pt';
  var COOKIE_NAME = 'sn_lang';
  var PUBLIC_ENABLED = ['pt'];

  function isPreviewMode() {
    try {
      var params = new URLSearchParams(window.location.search);
      return params.get('i18n_preview') === '1';
    } catch (_) {
      return false;
    }
  }

  function isPublicEnabled(lang) {
    return PUBLIC_ENABLED.indexOf(lang) !== -1 || isPreviewMode();
  }

  function getLang() {
    var m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]+)'));
    var lang = m ? decodeURIComponent(m[1]) : null;
    if (!lang) {
      try { lang = window.localStorage.getItem(COOKIE_NAME); } catch (_) {}
    }
    if (!lang || SUPPORTED.indexOf(lang) === -1 || !isPublicEnabled(lang)) lang = DEFAULT_LANG;
    return lang;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1 || !isPublicEnabled(lang)) return;
    var secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = COOKIE_NAME + '=' + encodeURIComponent(lang) + '; Path=/; Max-Age=31536000; SameSite=Lax' + secure;
    try { window.localStorage.setItem(COOKIE_NAME, lang); } catch (_) {}
    updateLangSwitch(lang);
  }

  function get(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o && o[k] !== undefined) ? o[k] : undefined;
    }, obj);
  }

  function loadLocale(lang) {
    var targetLang = isPublicEnabled(lang) ? lang : DEFAULT_LANG;
    return fetch('/locales/' + targetLang + '.json').then(function (r) {
      if (!r.ok) throw new Error('locale not found: ' + lang);
      return r.json();
    }).catch(function (err) {
      if (targetLang !== DEFAULT_LANG) return loadLocale(DEFAULT_LANG);
      throw err;
    });
  }

  function applyTranslations(data) {
    var els = document.querySelectorAll('[data-i18n]');
    els.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = get(data, key);
      if (val === undefined) return;
      var attr = el.getAttribute('data-i18n-attr');
      if (attr) {
        el.setAttribute(attr, val);
      } else if (el.hasAttribute('data-i18n-html')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
    if (data && data.meta && data.meta.code) document.documentElement.lang = data.meta.code;
  }

  function updateLangSwitch(current) {
    document.querySelectorAll('.sn-lang-switch button[data-lang]').forEach(function (btn) {
      var lang = btn.getAttribute('data-lang');
      var enabled = isPublicEnabled(lang);
      btn.classList.toggle('active', lang === current);
      btn.disabled = !enabled;
      btn.style.display = enabled ? '' : 'none';
      btn.setAttribute('aria-disabled', enabled ? 'false' : 'true');
    });
  }

  var readyResolve;
  window.I18N_READY = new Promise(function (res) { readyResolve = res; });
  window.I18N = null;

  function init() {
    var lang = getLang();
    return loadLocale(lang).then(function (data) {
      window.I18N = data;
      applyTranslations(data);
      readyResolve(data);
      return data;
    }).catch(function (err) {
      console.error('i18n init failed', err);
      readyResolve(null);
    });
  }

  window.SN_I18N = {
    getLang: getLang,
    setLang: setLang,
    loadLocale: loadLocale,
    applyTranslations: applyTranslations,
    isPreviewMode: isPreviewMode,
    PUBLIC_ENABLED: PUBLIC_ENABLED,
    SUPPORTED: SUPPORTED,
    init: init
  };

  /* Liga qualquer .sn-lang-switch button[data-lang] presente na página:
     marca o idioma atual como ativo e troca+recarrega ao clicar noutro. */
  function wireLangSwitch() {
    var current = getLang();
    document.querySelectorAll('.sn-lang-switch button[data-lang]').forEach(function (btn) {
      updateLangSwitch(current);
      btn.addEventListener('click', function () {
        var lang = btn.getAttribute('data-lang');
        if (lang === current) return;
        setLang(lang);
        window.location.reload();
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireLangSwitch);
  } else {
    wireLangSwitch();
  }

  init();
})(window, document);
