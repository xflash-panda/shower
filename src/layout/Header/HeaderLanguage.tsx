import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { headerLanguages as headerLanguagesData } from '@data/HeaderMenuData';

type LanguageCode = 'lang-zh' | 'lang-en';
type IconCode = 'chn' | 'usa';

// 语言代码映射 - 修改为使用完整的语言代码
const langCodeMapping: Record<LanguageCode, string> = {
  'lang-zh': 'zh-CN',
  'lang-en': 'en-US',
};

const iconCodeMapping: Record<string, IconCode> = {
  'zh-CN': 'chn',
  'en-US': 'usa',
};

const langMapping: Record<string, LanguageCode> = {
  'zh-CN': 'lang-zh',
  'en-US': 'lang-en',
};

const HeaderLanguage: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentIcon, setCurrentIcon] = useState<IconCode>('chn');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('lang-zh');

  // 根据当前语言初始化状态
  useEffect(() => {
    const currentLang = i18n.language;
    const mappedLang = langMapping[currentLang] || 'lang-zh';
    const mappedIcon = iconCodeMapping[currentLang] || 'chn';

    setSelectedLang(mappedLang);
    setCurrentIcon(mappedIcon);
  }, [i18n.language]);

  const handleLangChange = (lang: LanguageCode, icon: IconCode): void => {
    const i18nLang = langCodeMapping[lang];

    // 切换 i18next 语言
    void i18n.changeLanguage(i18nLang);

    // 更新本地状态
    setSelectedLang(lang);
    setCurrentIcon(icon);
  };

  return (
    <div id="lang_selector" className="flex-shrink-0 dropdown">
      <a
        href="#"
        className="d-block head-icon ps-0"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <div className={`lang-flag ${selectedLang}`}>
          <span className="flag rounded-circle overflow-hidden">
            <i className={`flag-icon flag-icon-${currentIcon} flag-icon-squared b-r-10 f-s-22`} />
          </span>
        </div>
      </a>
      <ul className="dropdown-menu language-dropdown header-card border-0">
        {headerLanguagesData.map(({ lang, title, label, icon }) => (
          <li
            key={lang}
            className={`lang ${lang} dropdown-item p-2 ${selectedLang === lang ? 'selected' : ''}`}
            title={title}
            onClick={() => handleLangChange(lang as LanguageCode, icon as IconCode)}
          >
            <span className="d-flex align-items-center">
              <i className={`flag-icon flag-icon-${icon} flag-icon-squared b-r-10 f-s-22`}></i>
              <span className="ps-2">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeaderLanguage;
