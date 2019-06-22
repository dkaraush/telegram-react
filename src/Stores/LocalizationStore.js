/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { EventEmitter } from 'events';
import Cookies from 'universal-cookie';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { initReactI18next } from 'react-i18next';
import TdLibController from '../Controllers/TdLibController';

const defaultLanguage = 'en';
const defaultNamespace = 'translation';
const cookies = new Cookies();
const language = cookies.get('i18next') || defaultLanguage;

// const detection = {
//     // order and from where user language should be detected
//     order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
//
//     // keys or params to lookup language from
//     lookupQuerystring: 'lng',
//     lookupCookie: 'i18next',
//     lookupLocalStorage: 'i18nextLng',
//     lookupFromPathIndex: 0,
//     lookupFromSubdomainIndex: 0,
//
//     // cache user language on
//     caches: ['localStorage', 'cookie']
// };

i18n.use(initReactI18next) //.use(LanguageDetector) // passes i18n down to react-i18next
    .init({
        //detection: detection,
        ns: [defaultNamespace, 'local'],
        defaultNS: defaultNamespace,
        fallbackNS: ['local', 'emoji'],
        resources: {
            en: {
                local: {
                    DeletedMessage: 'Deleted message',
                    YourPhone: 'Your Phone',
                    PhoneNumber: 'Phone Number',
                    PhoneCode: 'Code',
                    Country: 'Country',
                    StartText: 'Please confirm your country code and enter your phone number.',
                    Next: 'Next',
                    InvalidPhoneNumber: 'Invalid phone number. Please check the number and try again.',
                    More: 'More',
                    SendMessage: 'Send Message',
                    ChatInfo: 'Chat Info',
                    ChannelInfo: 'Channel Info',
                    Stickers: 'STICKERS',
                    Emoji: 'EMOJI'
                },
                emoji: {
                    Search: 'Search',
                    NotEmojiFound: 'No Emoji Found',
                    ChooseDefaultSkinTone: 'Choose your default skin tone',
                    SearchResults: 'Search Results',
                    Recent: 'Frequently Used',
                    SmileysPeople: 'Smileys & People',
                    AnimalsNature: 'Animals & Nature',
                    FoodDrink: 'Food & Drink',
                    Activity: 'Activity',
                    TravelPlaces: 'Travel & Places',
                    Objects: 'Objects',
                    Symbols: 'Symbols',
                    Flags: 'Flags',
                    Custom: 'Custom'
                },
                translation: {
                    AppName: 'Telegram',
                    Loading: 'Loading',
                    Connecting: 'Connecting',
                    Updating: 'Updating'
                },
                countries: {
                    AB: 'Abkhazia',
                    AF: 'Afghanistan',
                    AX: 'Åland Islands',
                    AL: 'Albania',
                    DZ: 'Algeria',
                    AS: 'American Samoa',
                    AD: 'Andorra',
                    AO: 'Angola',
                    AI: 'Anguilla',
                    AG: 'Antigua & Barbuda',
                    AR: 'Argentina',
                    AM: 'Armenia',
                    AW: 'Aruba',
                    SH_AC: 'Ascension',
                    AU: 'Australia',
                    AU_ET: 'Australian External Territories',
                    AT: 'Austria',
                    AZ: 'Azerbaijan',
                    BS: 'Bahamas',
                    BH: 'Bahrain',
                    BD: 'Bangladesh',
                    BB: 'Barbados',
                    AG_BAR: 'Barbuda',
                    BY: 'Belarus',
                    BE: 'Belgium',
                    BZ: 'Belize',
                    BJ: 'Benin',
                    BM: 'Bermuda',
                    BT: 'Bhutan',
                    BO: 'Bolivia',
                    BQ: 'Caribbean Netherlands',
                    BA: 'Bosnia & Herzegovina',
                    BW: 'Botswana',
                    BR: 'Brazil',
                    IO: 'British Indian Ocean Territory',
                    VG: 'British Virgin Islands',
                    BN: 'Brunei',
                    BG: 'Bulgaria',
                    BF: 'Burkina Faso',
                    MM: 'Myanmar (Burma)',
                    BI: 'Burundi',
                    KH: 'Cambodia',
                    CM: 'Cameroon',
                    CA: 'Canada',
                    CV: 'Cape Verde',
                    KY: 'Cayman Islands',
                    CF: 'Central African Republic',
                    TD: 'Chad',
                    CL: 'Chile',
                    CN: 'China',
                    CX: 'Christmas Island',
                    CC: 'Cocos (Keeling) Islands',
                    CO: 'Colombia',
                    KM: 'Comoros',
                    CG: 'Congo - Brazzaville',
                    CD: 'Congo - Kinshasa',
                    CK: 'Cook Islands',
                    CR: 'Costa Rica',
                    CI: 'Côte d’Ivoire',
                    HR: 'Croatia',
                    CU: 'Cuba',
                    CW: 'Curaçao',
                    CY: 'Cyprus',
                    CZ: 'Czech Republic',
                    DK: 'Denmark',
                    DG: 'Diego Garcia',
                    DJ: 'Djibouti',
                    DM: 'Dominica',
                    DO: 'Dominican Republic',
                    TL: 'Timor-Leste',
                    EC: 'Ecuador',
                    EG: 'Egypt',
                    SV: 'El Salvador',
                    GQ: 'Equatorial Guinea',
                    ER: 'Eritrea',
                    EE: 'Estonia',
                    ET: 'Ethiopia',
                    FK: 'Falkland Islands',
                    FO: 'Faroe Islands',
                    FJ: 'Fiji',
                    FI: 'Finland',
                    FR: 'France',
                    GF: 'French Guiana',
                    PF: 'French Polynesia',
                    GA: 'Gabon',
                    GM: 'Gambia',
                    GE: 'Georgia',
                    DE: 'Germany',
                    GH: 'Ghana',
                    GI: 'Gibraltar',
                    GR: 'Greece',
                    GL: 'Greenland',
                    GD: 'Grenada',
                    GP: 'Guadeloupe',
                    GU: 'Guam',
                    GT: 'Guatemala',
                    GG: 'Guernsey',
                    GN: 'Guinea',
                    GW: 'Guinea-Bissau',
                    GY: 'Guyana',
                    HT: 'Haiti',
                    HN: 'Honduras',
                    HK: 'Hong Kong SAR China',
                    HU: 'Hungary',
                    IS: 'Iceland',
                    IN: 'India',
                    ID: 'Indonesia',
                    IR: 'Iran',
                    IQ: 'Iraq',
                    IE: 'Ireland',
                    IL: 'Israel',
                    IT: 'Italy',
                    JM: 'Jamaica',
                    SJ: 'Svalbard & Jan Mayen',
                    JP: 'Japan',
                    JE: 'Jersey',
                    JO: 'Jordan',
                    KZ: 'Kazakhstan',
                    KE: 'Kenya',
                    KI: 'Kiribati',
                    KP: 'North Korea',
                    KR: 'South Korea',
                    KW: 'Kuwait',
                    KG: 'Kyrgyzstan',
                    LA: 'Laos',
                    LV: 'Latvia',
                    LB: 'Lebanon',
                    LS: 'Lesotho',
                    LR: 'Liberia',
                    LY: 'Libya',
                    LI: 'Liechtenstein',
                    LT: 'Lithuania',
                    LU: 'Luxembourg',
                    MO: 'Macau SAR China',
                    MK: 'Macedonia',
                    MG: 'Madagascar',
                    MW: 'Malawi',
                    MY: 'Malaysia',
                    MV: 'Maldives',
                    ML: 'Mali',
                    MT: 'Malta',
                    MH: 'Marshall Islands',
                    MQ: 'Martinique',
                    MR: 'Mauritania',
                    MU: 'Mauritius',
                    YT: 'Mayotte',
                    MX: 'Mexico',
                    FM: 'Micronesia',
                    MD: 'Moldova',
                    MC: 'Monaco',
                    MN: 'Mongolia',
                    ME: 'Montenegro',
                    MS: 'Montserrat',
                    MA: 'Morocco',
                    MZ: 'Mozambique',
                    NA: 'Namibia',
                    NR: 'Nauru',
                    NP: 'Nepal',
                    NL: 'Netherlands',
                    NC: 'New Caledonia',
                    NZ: 'New Zealand',
                    NI: 'Nicaragua',
                    NE: 'Niger',
                    NG: 'Nigeria',
                    NU: 'Niue',
                    NF: 'Norfolk Island',
                    MP: 'Northern Mariana Islands',
                    NO: 'Norway',
                    OM: 'Oman',
                    PK: 'Pakistan',
                    PW: 'Palau',
                    PS: 'Palestinian Territories',
                    PA: 'Panama',
                    PG: 'Papua New Guinea',
                    PY: 'Paraguay',
                    PE: 'Peru',
                    PH: 'Philippines',
                    PN: 'Pitcairn Islands',
                    PL: 'Poland',
                    PT: 'Portugal',
                    PR: 'Puerto Rico',
                    QA: 'Qatar',
                    RE: 'Réunion',
                    RO: 'Romania',
                    RU: 'Russia',
                    RW: 'Rwanda',
                    BL: 'St. Barthélemy',
                    SH: 'St. Helena',
                    KN: 'St. Kitts & Nevis',
                    LC: 'St. Lucia',
                    MF: 'St. Martin (France)',
                    PM: 'St. Pierre and Miquelon',
                    VC: 'St. Vincent and the Grenadines',
                    WS: 'Samoa',
                    SM: 'San Marino',
                    ST: 'São Tomé & Príncipe',
                    SA: 'Saudi Arabia',
                    SN: 'Senegal',
                    RS: 'Serbia',
                    SC: 'Seychelles',
                    SL: 'Sierra Leone',
                    SG: 'Singapore',
                    NL_BQ3: 'Sint Eustatius',
                    SX: 'Sint Maarten',
                    SK: 'Slovakia',
                    SI: 'Slovenia',
                    SB: 'Solomon Islands',
                    SO: 'Somalia',
                    ZA: 'South Africa',
                    GS: 'South Georgia & South Sandwich Islands',
                    GE_SO: 'South Ossetia',
                    SS: 'South Sudan',
                    ES: 'Spain',
                    LK: 'Sri Lanka',
                    SD: 'Sudan',
                    SR: 'Suriname',
                    SJ_NO: 'Svalbard',
                    SZ: 'Swaziland',
                    SE: 'Sweden',
                    CH: 'Switzerland',
                    SY: 'Syria',
                    TW: 'Taiwan',
                    TJ: 'Tajikistan',
                    TZ: 'Tanzania',
                    TH: 'Thailand',
                    TG: 'Togo',
                    TK: 'Tokelau',
                    TO: 'Tonga',
                    TT: 'Trinidad & Tobago',
                    TN: 'Tunisia',
                    TR: 'Turkey',
                    TM: 'Turkmenistan',
                    TC: 'Turks & Caicos Islands',
                    TV: 'Tuvalu',
                    UG: 'Uganda',
                    UA: 'Ukraine',
                    AE: 'United Arab Emirates',
                    UK: 'United Kingdom',
                    US: 'United States',
                    UY: 'Uruguay',
                    VI: 'U.S. Virgin Islands',
                    UZ: 'Uzbekistan',
                    VU: 'Vanuatu',
                    VE: 'Venezuela',
                    VA: 'Vatican City',
                    VN: 'Vietnam',
                    WF: 'Wallis & Futuna',
                    YE: 'Yemen',
                    ZM: 'Zambia',
                    TZ_UK: 'Zanzibar',
                    ZW: 'Zimbabwe'
                }
            },
            ru: {
                local: {
                    DeletedMessage: 'Удаленное сообщение',
                    YourPhone: 'Ваш телефон',
                    PhoneNumber: 'Номер телефона',
                    PhoneCode: 'Код',
                    Country: 'Страна',
                    StartText: 'Пожалуйста, укажите код страны и свой номер телефона.',
                    Next: 'Далее',
                    InvalidPhoneNumber:
                        'Некорректный номер телефона. Пожалуйста, проверьте номер и попробуйте ещё раз.',
                    More: 'Ещё',
                    SendMessage: 'Отправить сообщение',
                    ChatInfo: 'Информация о чате',
                    ChannelInfo: 'Информация о канале',
                    Stickers: 'СТИКЕРЫ',
                    Emoji: 'ЕМОДЗИ'
                },
                emoji: {
                    Search: 'Поиск',
                    NotEmojiFound: 'Емодзи не найдены',
                    ChooseDefaultSkinTone: 'Выберите тон кожи по умолчанию',
                    SearchResults: 'Результаты поиска',
                    Recent: 'Часто используемые',
                    SmileysPeople: 'Смайлики и люди',
                    AnimalsNature: 'Животные и природа',
                    FoodDrink: 'Еда и напитки',
                    Activity: 'Активность',
                    TravelPlaces: 'Путешествия и местности',
                    Objects: 'Предметы',
                    Symbols: 'Символы',
                    Flags: 'Флаги',
                    Custom: 'Пользовательские'
                },
                translation: {
                    AppName: 'Телеграм',
                    Loading: 'Загрузка',
                    Connecting: 'Соединение',
                    Updating: 'Обновление'
                },
                countries: {
                    AB: 'Абхазия',
                    AF: 'Афганистан',
                    AX: 'Аландские о-ва',
                    AL: 'Албания',
                    DZ: 'Алжир',
                    AS: 'Американское Самоа',
                    AD: 'Андорра',
                    AO: 'Ангола',
                    AI: 'Ангилья',
                    AG: 'Антигуа и Барбуда',
                    AR: 'Аргентина',
                    AM: 'Армения',
                    AW: 'Аруба',
                    SH_AC: 'Остров Вознесения',
                    AU: 'Австралия',
                    AU_ET: 'Австралийские Антарктические Территории',
                    AT: 'Австрия',
                    AZ: 'Азербайджан',
                    BS: 'Багамские о-ва',
                    BH: 'Бахрейн',
                    BD: 'Бангладеш',
                    BB: 'Барбадос',
                    AG_BAR: 'Барбуда',
                    BY: 'Беларусь',
                    BE: 'Бельгия',
                    BZ: 'Белиз',
                    BJ: 'Бенин',
                    BM: 'Бермудские о-ва',
                    BT: 'Бутан',
                    BO: 'Боливия',
                    BQ: 'Бонэйр, Синт-Эстатиус и Саба',
                    BA: 'Босния и Герцеговина',
                    BW: 'Ботсвана',
                    BR: 'Бразилия',
                    IO: 'Британская территория в Индийском океане',
                    VG: 'Виргинские о-ва (Британские)',
                    BN: 'Бруней-Даруссалам',
                    BG: 'Болгария',
                    BF: 'Буркина-Фасо',
                    MM: 'Мьянма (Бирма)',
                    BI: 'Бурунди',
                    KH: 'Камбоджа',
                    CM: 'Камерун',
                    CA: 'Канада',
                    CV: 'Кабо-Верде',
                    KY: 'Каймановы о-ва',
                    CF: 'ЦАР',
                    TD: 'Чад',
                    CL: 'Чили',
                    CN: 'Китай',
                    CX: 'о-в Рождества',
                    CC: 'Кокосовые о-ва',
                    CO: 'Колумбия',
                    KM: 'Коморские о-ва',
                    CG: 'Конго - Браззавиль',
                    CD: 'Конго - Киншаса',
                    CK: 'о-ва Кука',
                    CR: 'Коста-Рика',
                    CI: 'Кот-д’Ивуар',
                    HR: 'Хорватия',
                    CU: 'Куба',
                    CW: 'Кюрасао',
                    CY: 'Кипр',
                    CZ: 'Чехия',
                    DK: 'Дания',
                    DG: 'Диего-Гарсия',
                    DJ: 'Джибути',
                    DM: 'Доминика',
                    DO: 'Доминиканская Республика',
                    TL: 'Восточный Тимор',
                    EC: 'Эквадор',
                    EG: 'Египет',
                    SV: 'Сальвадор',
                    GQ: 'Экваториальная Гвинея',
                    ER: 'Эритрея',
                    EE: 'Эстония',
                    ET: 'Эфиопия',
                    FK: 'Фолклендские о-ва',
                    FO: 'Фарерские о-ва',
                    FJ: 'Фиджи',
                    FI: 'Финляндия',
                    FR: 'Франция',
                    GF: 'Французская Гвиана',
                    PF: 'Французская Полинезия',
                    GA: 'Габон',
                    GM: 'Гамбия',
                    GE: 'Грузия',
                    DE: 'Германия',
                    GH: 'Гана',
                    GI: 'Гибралтар',
                    GR: 'Греция',
                    GL: 'Гренландия',
                    GD: 'Гренада',
                    GP: 'Гваделупа',
                    GU: 'Гуам',
                    GT: 'Гватемала',
                    GG: 'Гернси',
                    GN: 'Гвинея',
                    GW: 'Гвинея-Бисау',
                    GY: 'Гайана',
                    HT: 'Гаити',
                    HN: 'Гондурас',
                    HK: 'Гонконг (особый район)',
                    HU: 'Венгрия',
                    IS: 'Исландия',
                    IN: 'Индия',
                    ID: 'Индонезия',
                    IR: 'Иран',
                    IQ: 'Ирак',
                    IE: 'Ирландия',
                    IL: 'Израиль',
                    IT: 'Италия',
                    JM: 'Ямайка',
                    SJ: 'Шпицберген и Ян-Майен',
                    JP: 'Япония',
                    JE: 'Джерси',
                    JO: 'Иордания',
                    KZ: 'Казахстан',
                    KE: 'Кения',
                    KI: 'Кирибати',
                    KP: 'КНДР',
                    KR: 'Республика Корея',
                    KW: 'Кувейт',
                    KG: 'Киргизия',
                    LA: 'Лаос',
                    LV: 'Латвия',
                    LB: 'Ливан',
                    LS: 'Лесото',
                    LR: 'Либерия',
                    LY: 'Ливия',
                    LI: 'Лихтенштейн',
                    LT: 'Литва',
                    LU: 'Люксембург',
                    MO: 'Макао (особый район)',
                    MK: 'Македония',
                    MG: 'Мадагаскар',
                    MW: 'Малави',
                    MY: 'Малайзия',
                    MV: 'Мальдивские о-ва',
                    ML: 'Мали',
                    MT: 'Мальта',
                    MH: 'Маршалловы о-ва',
                    MQ: 'Мартиника',
                    MR: 'Мавритания',
                    MU: 'Маврикий',
                    YT: 'Майотта',
                    MX: 'Мексика',
                    FM: 'Федеративные Штаты Микронезии',
                    MD: 'Молдова',
                    MC: 'Монако',
                    MN: 'Монголия',
                    ME: 'Черногория',
                    MS: 'Монтсеррат',
                    MA: 'Марокко',
                    MZ: 'Мозамбик',
                    NA: 'Намибия',
                    NR: 'Науру',
                    NP: 'Непал',
                    NL: 'Нидерланды',
                    NC: 'Новая Каледония',
                    NZ: 'Новая Зеландия',
                    NI: 'Никарагуа',
                    NE: 'Нигер',
                    NG: 'Нигерия',
                    NU: 'Ниуэ',
                    NF: 'о-в Норфолк',
                    MP: 'Северные Марианские о-ва',
                    NO: 'Норвегия',
                    OM: 'Оман',
                    PK: 'Пакистан',
                    PW: 'Палау',
                    PS: 'Палестинские территории',
                    PA: 'Панама',
                    PG: 'Папуа – Новая Гвинея',
                    PY: 'Парагвай',
                    PE: 'Перу',
                    PH: 'Филиппины',
                    PN: 'Питкэрн',
                    PL: 'Польша',
                    PT: 'Португалия',
                    PR: 'Пуэрто-Рико',
                    QA: 'Катар',
                    RE: 'Реюньон',
                    RO: 'Румыния',
                    RU: 'Россия',
                    RW: 'Руанда',
                    BL: 'Сен-Бартельми',
                    SH: 'О-в Св. Елены',
                    KN: 'Сент-Китс и Невис',
                    LC: 'Сент-Люсия',
                    MF: 'Сен-Мартен (Франция)',
                    PM: 'Сен-Пьер и Микелон',
                    VC: 'Сент-Винсент и Гренадины',
                    WS: 'Самоа',
                    SM: 'Сан-Марино',
                    ST: 'Сан-Томе и Принсипи',
                    SA: 'Саудовская Аравия',
                    SN: 'Сенегал',
                    RS: 'Сербия',
                    SC: 'Сейшельские о-ва',
                    SL: 'Сьерра-Леоне',
                    SG: 'Сингапур',
                    NL_BQ3: 'Синт-Эстатиус',
                    SX: 'Синт-Мартен',
                    SK: 'Словакия',
                    SI: 'Словения',
                    SB: 'Соломоновы о-ва',
                    SO: 'Сомали',
                    ZA: 'ЮАР',
                    GS: 'Южная Георгия и Южные Сандвичевы о-ва',
                    GE_SO: 'Южная Осетия',
                    SS: 'Южный Судан',
                    ES: 'Испания',
                    LK: 'Шри-Ланка',
                    SD: 'Судан',
                    SR: 'Суринам',
                    SJ_NO: 'Шпицберген',
                    SZ: 'Свазиленд',
                    SE: 'Швеция',
                    CH: 'Швейцария',
                    SY: 'Сирия',
                    TW: 'Тайвань',
                    TJ: 'Таджикистан',
                    TZ: 'Танзания',
                    TH: 'Таиланд',
                    TG: 'Того',
                    TK: 'Токелау',
                    TO: 'Тонга',
                    TT: 'Тринидад и Тобаго',
                    TN: 'Тунис',
                    TR: 'Турция',
                    TM: 'Туркменистан',
                    TC: 'О-ва Тёркс и Кайкос',
                    TV: 'Тувалу',
                    UG: 'Уганда',
                    UA: 'Украина',
                    AE: 'ОАЭ',
                    UK: 'Великобритания',
                    US: 'Соединенные Штаты',
                    UY: 'Уругвай',
                    VI: 'Виргинские о-ва (США)',
                    UZ: 'Узбекистан',
                    VU: 'Вануату',
                    VE: 'Венесуэла',
                    VA: 'Ватикан',
                    VN: 'Вьетнам',
                    WF: 'Уоллис и Футуна',
                    YE: 'Йемен',
                    ZM: 'Замбия',
                    TZ_UK: 'Занзибар',
                    ZW: 'Зимбабве'
                }
            }
        },
        lng: language,
        fallbackLng: defaultLanguage,
        interpolation: {
            escapeValue: false
        },
        react: {
            wait: false
        }
    });

const cache = new LocalStorageBackend(null, {
    enabled: true,
    prefix: 'i18next_res_',
    expirationTime: Infinity
});

const translationDefaultLng = cache.read(defaultLanguage, defaultNamespace, (err, data) => {
    return data;
});
const translationCurrentLng = cache.read(language, defaultNamespace, (err, data) => {
    return data;
});
i18n.addResourceBundle(defaultLanguage, defaultNamespace, translationDefaultLng);
i18n.addResourceBundle(language, defaultNamespace, translationCurrentLng);

class LocalizationStore extends EventEmitter {
    constructor() {
        super();

        this.i18n = i18n;
        this.cache = cache;

        this.setMaxListeners(Infinity);
        this.addTdLibListener();
    }

    addTdLibListener = () => {
        TdLibController.addListener('update', this.onUpdate);
        TdLibController.addListener('clientUpdate', this.onClientUpdate);
    };

    removeTdLibListener = () => {
        TdLibController.removeListener('update', this.onUpdate);
        TdLibController.removeListener('clientUpdate', this.onClientUpdate);
    };

    onUpdate = update => {
        switch (update['@type']) {
            case 'updateAuthorizationState': {
                switch (update.authorization_state['@type']) {
                    case 'authorizationStateWaitTdlibParameters':
                        TdLibController.send({
                            '@type': 'setOption',
                            name: 'localization_target',
                            value: { '@type': 'optionValueString', value: 'android' }
                        });
                        TdLibController.send({
                            '@type': 'setOption',
                            name: 'language_pack_id',
                            value: { '@type': 'optionValueString', value: language }
                        });
                        TdLibController.send({
                            '@type': 'getLocalizationTargetInfo',
                            only_local: false
                        }).then(result => {
                            this.info = result;

                            TdLibController.clientUpdate({
                                '@type': 'clientUpdateLanguageChange',
                                language: language
                            });
                        });
                        break;
                }
                break;
            }
            case 'updateLanguagePackStrings': {
                // add/remove new strings

                this.emit('updateLanguagePackStrings', update);
                break;
            }
        }
    };

    onClientUpdate = async update => {
        switch (update['@type']) {
            case 'clientUpdateLanguageChange': {
                const { language } = update;

                TdLibController.send({
                    '@type': 'getLanguagePackStrings',
                    language_pack_id: language,
                    keys: []
                }).then(async result => {
                    const cookies = new Cookies();
                    cookies.set('i18next', language);

                    const resources = this.processStrings(language, result);

                    this.cache.save(language, defaultNamespace, resources);

                    i18n.addResourceBundle(language, defaultNamespace, resources);

                    await i18n.changeLanguage(language);

                    TdLibController.send({
                        '@type': 'setOption',
                        name: 'language_pack_id',
                        value: { '@type': 'optionValueString', value: language }
                    });

                    this.emit('clientUpdateLanguageChange', update);
                });
                break;
            }
        }
    };

    processStrings = (lng, languagePackStrings) => {
        if (!languagePackStrings) return {};
        const { strings } = languagePackStrings;
        if (!strings) return {};

        let result = {};
        for (let i = 0; i < strings.length; i++) {
            const { value } = strings[i];
            switch (value['@type']) {
                case 'languagePackStringValueOrdinary': {
                    result[strings[i].key] = value.value;
                    break;
                }
                case 'languagePackStringValuePluralized': {
                    //result[strings[i].key] = value.value;
                    break;
                }
                case 'languagePackStringValueDeleted': {
                    break;
                }
            }
        }

        return result;
    };

    loadLanguage = async language => {
        const result = await TdLibController.send({
            '@type': 'getLanguagePackStrings',
            language_pack_id: language,
            keys: []
        });

        const resources = this.processStrings(language, result);

        this.cache.save(language, defaultNamespace, resources);

        i18n.addResourceBundle(language, defaultNamespace, resources);
    };
}

const store = new LocalizationStore();
window.localization = store;
export default store;
