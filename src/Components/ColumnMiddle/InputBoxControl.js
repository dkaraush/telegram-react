/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';
import emojiRegex from 'emoji-regex';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AttachButton from './../ColumnMiddle/AttachButton';
import CreatePollDialog from '../Dialog/CreatePollDialog';
import IconButton from '@material-ui/core/IconButton';
import InputBoxHeader from './InputBoxHeader';
import OutputTypingManager from '../../Utils/OutputTypingManager';
import { getSize, readImageSize } from '../../Utils/Common';
import { getChatDraft, getChatDraftReplyToMessageId, isMeChat, isPrivateChat } from '../../Utils/Chat';
import { borderStyle } from '../Theme';
import { PHOTO_SIZE } from '../../Constants';
import MessageStore from '../../Stores/MessageStore';
import ChatStore from '../../Stores/ChatStore';
import ApplicationStore from '../../Stores/ApplicationStore';
import FileStore from '../../Stores/FileStore';
import StickerStore from '../../Stores/StickerStore';
import TdLibController from '../../Controllers/TdLibController';
import './InputBoxControl.css';

const EmojiPickerButton = React.lazy(() => import('./../ColumnMiddle/EmojiPickerButton'));

const styles = theme => ({
    iconButton: {
        margin: '8px 0'
    },
    closeIconButton: {
        margin: 0
    },
    ...borderStyle(theme)
});

class InputBoxControl extends Component {
    constructor(props) {
        super(props);

        this.attachDocumentRef = React.createRef();
        this.attachPhotoRef = React.createRef();
        this.newMessageRef = React.createRef();

        const chatId = ApplicationStore.getChatId();

        this.innerHTML = null;
        this.state = {
            chatId: chatId,
            replyToMessageId: getChatDraftReplyToMessageId(chatId),
            openPasteDialog: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { theme, t } = this.props;
        const { chatId, replyToMessageId, openPasteDialog } = this.state;

        if (nextProps.theme !== theme) {
            return true;
        }

        if (nextProps.t !== t) {
            return true;
        }

        if (nextState.chatId !== chatId) {
            return true;
        }

        if (nextState.replyToMessageId !== replyToMessageId) {
            return true;
        }

        if (nextState.openPasteDialog !== openPasteDialog) {
            return true;
        }

        return false;
    }

    componentDidMount() {
        //console.log('Perf componentDidMount');

        ApplicationStore.on('clientUpdateChatId', this.onClientUpdateChatId);
        MessageStore.on('clientUpdateReply', this.onClientUpdateReply);
        StickerStore.on('clientUpdateStickerSend', this.onClientUpdateStickerSend);

        this.setInputFocus();
        this.setDraft();
        this.handleInput();
    }

    componentWillUnmount() {
        const newChatDraftMessage = this.getNewChatDraftMessage(this.state.chatId, this.state.replyToMessageId);
        this.setChatDraftMessage(newChatDraftMessage);

        ApplicationStore.removeListener('clientUpdateChatId', this.onClientUpdateChatId);
        MessageStore.removeListener('clientUpdateReply', this.onClientUpdateReply);
        StickerStore.removeListener('clientUpdateStickerSend', this.onClientUpdateStickerSend);
    }

    onClientUpdateStickerSend = update => {
        const { sticker: item } = update;
        if (!item) return;

        const { sticker, thumbnail, width, height } = item;
        if (!sticker) return;

        this.newMessageRef.current.innerText = null;
        this.newMessageRef.current.textContent = null;
        this.innerHTML = null;

        const content = {
            '@type': 'inputMessageSticker',
            sticker: {
                '@type': 'inputFileId',
                id: sticker.id
            },
            width,
            height
        };

        if (thumbnail) {
            const { width: thumbnailWidth, height: thumbnailHeight, photo } = thumbnail;

            content.thumbnail = {
                thumbnail: {
                    '@type': 'inputFileId',
                    id: photo.id
                },
                width: thumbnailWidth,
                height: thumbnailHeight
            };
        }

        this.onSendInternal(content, true, result => {});

        TdLibController.clientUpdate({
            '@type': 'clientUpdateLocalStickersHint',
            hint: null
        });
    };

    onClientUpdateReply = update => {
        const { chatId: currentChatId } = this.state;
        const { chatId, messageId } = update;

        if (currentChatId !== chatId) {
            return;
        }

        this.setState({ replyToMessageId: messageId });

        if (messageId) {
            this.setInputFocus();
        }
    };

    onClientUpdateChatId = update => {
        const { chatId } = this.state;
        if (chatId === update.nextChatId) return;

        this.innerHTML = null;
        this.setState({
            chatId: update.nextChatId,
            replyToMessageId: getChatDraftReplyToMessageId(update.nextChatId),
            openPasteDialog: false
        });
    };

    setDraft = () => {
        const { chatId } = this.state;

        const element = this.newMessageRef.current;

        const draft = getChatDraft(chatId);
        if (draft) {
            element.innerText = draft.text;
            this.innerHTML = draft.text;
        } else {
            element.innerText = null;
            this.innerHTML = null;
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        //console.log('Perf componentDidUpdate');
        this.setChatDraftMessage(snapshot);

        if (prevState.chatId !== this.state.chatId) {
            this.setInputFocus();
            this.setDraft();
            this.handleInput();
        }
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevState.chatId === this.state.chatId) return null;

        return this.getNewChatDraftMessage(prevState.chatId, prevState.replyToMessageId);
    }

    setInputFocus = () => {
        setTimeout(() => {
            if (this.newMessageRef.current) {
                const element = this.newMessageRef.current;

                if (element.childNodes.length > 0) {
                    const range = document.createRange();
                    range.setStart(element.childNodes[0], element.childNodes[0].length);
                    range.collapse(true);

                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                element.focus();
            }
        }, 100);
    };

    setChatDraftMessage = chatDraftMessage => {
        if (!chatDraftMessage) return;

        const { chatId, draftMessage } = chatDraftMessage;
        if (!chatId) return;

        TdLibController.send({
            '@type': 'setChatDraftMessage',
            chat_id: chatId,
            draft_message: draftMessage
        });
    };

    getNewChatDraftMessage = (chatId, replyToMessageId) => {
        let chat = ChatStore.get(chatId);
        if (!chat) return;
        const newDraft = this.getInputText();

        let previousDraft = '';
        let previousReplyToMessageId = 0;
        const { draft_message } = chat;
        if (draft_message && draft_message.input_message_text && draft_message.input_message_text.text) {
            const { reply_to_message_id, input_message_text } = draft_message;

            previousReplyToMessageId = reply_to_message_id;
            if (input_message_text && input_message_text.text) {
                previousDraft = input_message_text.text.text;
            }
        }

        if (newDraft !== previousDraft || replyToMessageId !== previousReplyToMessageId) {
            const draftMessage = {
                '@type': 'draftMessage',
                reply_to_message_id: replyToMessageId,
                input_message_text: {
                    '@type': 'inputMessageText',
                    text: {
                        '@type': 'formattedText',
                        text: newDraft,
                        entities: null
                    },
                    disable_web_page_preview: true,
                    clear_draft: false
                }
            };

            return { chatId: chatId, draftMessage: draftMessage };
        }

        return null;
    };

    handleSubmit = () => {
        let text = this.getInputText();

        this.newMessageRef.current.innerText = null;
        this.newMessageRef.current.textContent = null;
        this.innerHTML = null;

        if (!text) return;

        const content = {
            '@type': 'inputMessageText',
            text: this.formatText(text),
            disable_web_page_preview: false,
            clear_draft: true
        };

        this.onSendInternal(content, false, result => {});
    };

    formatText = (text) => {
        let entities = this.parseEntities(text);
        text = this.parseMarkdown(text, entities);
        console.log(entities);
        return {
            '@type': 'formattedText',
            text: text,
            entities: entities
        }
    };

    textEntity = (type, offset, length, options) => {
        return {
            '@type': 'textEntity',
            length: length,
            offset: offset,
            type: Object.assign({
                '@type': type
            }, options || {})
        }
    };

    // this code has been taken from https://github.com/zhukov/webogram/blob/c5fc5107cad2a476a03d7ce8427f1def41c20568/app/js/lib/ng_utils.js
    parseEntities = (text, options) => {
        const domainAddChars = '\u00b7';
        const TLD = ["abogado","ac","academy","accountants","active","actor","ad","adult","ae","aero","af","ag","agency","ai","airforce","al","allfinanz","alsace","am","amsterdam","an","android","ao","apartments","aq","aquarelle","ar","archi","army","arpa","as","asia","associates","at","attorney","au","auction","audio","autos","aw","ax","axa","az","ba","band","bank","bar","barclaycard","barclays","bargains","bayern","bb","bd","be","beer","berlin","best","bf","bg","bh","bi","bid","bike","bingo","bio","biz","bj","black","blackfriday","bloomberg","blue","bm","bmw","bn","bnpparibas","bo","boo","boutique","br","brussels","bs","bt","budapest","build","builders","business","buzz","bv","bw","by","bz","bzh","ca","cab","cal","camera","camp","cancerresearch","canon","capetown","capital","caravan","cards","care","career","careers","cartier","casa","cash","cat","catering","cc","cd","center","ceo","cern","cf","cg","ch","channel","chat","cheap","christmas","chrome","church","ci","citic","city","ck","cl","claims","cleaning","click","clinic","clothing","club","cm","cn","co","coach","codes","coffee","college","cologne","com","community","company","computer","condos","construction","consulting","contractors","cooking","cool","coop","country","cr","credit","creditcard","cricket","crs","cruises","cu","cuisinella","cv","cw","cx","cy","cymru","cz","dabur","dad","dance","dating","day","dclk","de","deals","degree","delivery","democrat","dental","dentist","desi","design","dev","diamonds","diet","digital","direct","directory","discount","dj","dk","dm","dnp","do","docs","domains","doosan","durban","dvag","dz","eat","ec","edu","education","ee","eg","email","emerck","energy","engineer","engineering","enterprises","equipment","er","es","esq","estate","et","eu","eurovision","eus","events","everbank","exchange","expert","exposed","fail","farm","fashion","feedback","fi","finance","financial","firmdale","fish","fishing","fit","fitness","fj","fk","flights","florist","flowers","flsmidth","fly","fm","fo","foo","forsale","foundation","fr","frl","frogans","fund","furniture","futbol","ga","gal","gallery","garden","gb","gbiz","gd","ge","gent","gf","gg","ggee","gh","gi","gift","gifts","gives","gl","glass","gle","global","globo","gm","gmail","gmo","gmx","gn","goog","google","gop","gov","gp","gq","gr","graphics","gratis","green","gripe","gs","gt","gu","guide","guitars","guru","gw","gy","hamburg","hangout","haus","healthcare","help","here","hermes","hiphop","hiv","hk","hm","hn","holdings","holiday","homes","horse","host","hosting","house","how","hr","ht","hu","ibm","id","ie","ifm","il","im","immo","immobilien","in","industries","info","ing","ink","institute","insure","int","international","investments","io","iq","ir","irish","is","it","iwc","jcb","je","jetzt","jm","jo","jobs","joburg","jp","juegos","kaufen","kddi","ke","kg","kh","ki","kim","kitchen","kiwi","km","kn","koeln","kp","kr","krd","kred","kw","ky","kyoto","kz","la","lacaixa","land","lat","latrobe","lawyer","lb","lc","lds","lease","legal","lgbt","li","lidl","life","lighting","limited","limo","link","lk","loans","london","lotte","lotto","lr","ls","lt","ltda","lu","luxe","luxury","lv","ly","ma","madrid","maison","management","mango","market","marketing","marriott","mc","md","me","media","meet","melbourne","meme","memorial","menu","mg","mh","miami","mil","mini","mk","ml","mm","mn","mo","mobi","moda","moe","monash","money","mormon","mortgage","moscow","motorcycles","mov","mp","mq","mr","ms","mt","mu","museum","mv","mw","mx","my","mz","na","nagoya","name","navy","nc","ne","net","network","neustar","new","nexus","nf","ng","ngo","nhk","ni","nico","ninja","nl","no","np","nr","nra","nrw","ntt","nu","nyc","nz","okinawa","om","one","ong","onl","ooo","org","organic","osaka","otsuka","ovh","pa","paris","partners","parts","party","pe","pf","pg","ph","pharmacy","photo","photography","photos","physio","pics","pictures","pink","pizza","pk","pl","place","plumbing","pm","pn","pohl","poker","porn","post","pr","praxi","press","pro","prod","productions","prof","properties","property","ps","pt","pub","pw","py","qa","qpon","quebec","re","realtor","recipes","red","rehab","reise","reisen","reit","ren","rentals","repair","report","republican","rest","restaurant","reviews","rich","rio","rip","ro","rocks","rodeo","rs","rsvp","ru","ruhr","rw","ryukyu","sa","saarland","sale","samsung","sarl","saxo","sb","sc","sca","scb","schmidt","schule","schwarz","science","scot","sd","se","services","sew","sexy","sg","sh","shiksha","shoes","shriram","si","singles","sj","sk","sky","sl","sm","sn","so","social","software","sohu","solar","solutions","soy","space","spiegel","sr","st","style","su","supplies","supply","support","surf","surgery","suzuki","sv","sx","sy","sydney","systems","sz","taipei","tatar","tattoo","tax","tc","td","technology","tel","temasek","tennis","tf","tg","th","tienda","tips","tires","tirol","tj","tk","tl","tm","tn","to","today","tokyo","tools","top","toshiba","town","toys","tp","tr","trade","training","travel","trust","tt","tui","tv","tw","tz","ua","ug","uk","university","uno","uol","us","uy","uz","va","vacations","vc","ve","vegas","ventures","versicherung","vet","vg","vi","viajes","video","villas","vision","vlaanderen","vn","vodka","vote","voting","voto","voyage","vu","wales","wang","watch","webcam","website","wed","wedding","wf","whoswho","wien","wiki","williamhill","wme","work","works","world","ws","wtc","wtf","佛山","集团","在线","한국","ভারত","八卦","موقع","公益","公司","移动","我爱你","москва","қаз","онлайн","сайт","срб","淡马锡","орг","삼성","சிங்கப்பூர்","商标","商店","商城","дети","мкд","中文网","中信","中国","中國","谷歌","భారత్","ලංකා","ભારત","भारत","网店","संगठन","网络","укр","香港","台湾","台灣","手机","мон","الجزائر","عمان","ایران","امارات","بازار","الاردن","بھارت","المغرب","السعودية","مليسيا","شبكة","გე","机构","组织机构","ไทย","سورية","рус","рф","تونس","みんな","グーグル","世界","ਭਾਰਤ","网址","游戏","vermögensberater","vermögensberatung","企业","مصر","قطر","广东","இலங்கை","இந்தியா","新加坡","فلسطين","政务","xxx","xyz","yachts","yandex","ye","yoga","yokohama","youtube","yt","za","zip","zm","zone","zuerich","zw"];
        const alphaCharsRegExp = 'a-z' +
          '\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u00ff' + // Latin-1
          '\\u0100-\\u024f' + // Latin Extended A and B
          '\\u0253\\u0254\\u0256\\u0257\\u0259\\u025b\\u0263\\u0268\\u026f\\u0272\\u0289\\u028b' + // IPA Extensions
          '\\u02bb' + // Hawaiian
          '\\u0300-\\u036f' + // Combining diacritics
          '\\u1e00-\\u1eff' + // Latin Extended Additional (mostly for Vietnamese)
          '\\u0400-\\u04ff\\u0500-\\u0527' + // Cyrillic
          '\\u2de0-\\u2dff\\ua640-\\ua69f' + // Cyrillic Extended A/B
          '\\u0591-\\u05bf\\u05c1-\\u05c2\\u05c4-\\u05c5\\u05c7' +
          '\\u05d0-\\u05ea\\u05f0-\\u05f4' + // Hebrew
          '\\ufb1d-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40-\\ufb41' +
          '\\ufb43-\\ufb44\\ufb46-\\ufb4f' + // Hebrew Pres. Forms
          '\\u0610-\\u061a\\u0620-\\u065f\\u066e-\\u06d3\\u06d5-\\u06dc' +
          '\\u06de-\\u06e8\\u06ea-\\u06ef\\u06fa-\\u06fc\\u06ff' + // Arabic
          '\\u0750-\\u077f\\u08a0\\u08a2-\\u08ac\\u08e4-\\u08fe' + // Arabic Supplement and Extended A
          '\\ufb50-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb' + // Pres. Forms A
          '\\ufe70-\\ufe74\\ufe76-\\ufefc' + // Pres. Forms B
          '\\u200c' + // Zero-Width Non-Joiner
          '\\u0e01-\\u0e3a\\u0e40-\\u0e4e' + // Thai
          '\\u1100-\\u11ff\\u3130-\\u3185\\uA960-\\uA97F\\uAC00-\\uD7AF\\uD7B0-\\uD7FF' + // Hangul (Korean)
          '\\u3003\\u3005\\u303b' + // Kanji/Han iteration marks
          '\\uff21-\\uff3a\\uff41-\\uff5a' + // full width Alphabet
          '\\uff66-\\uff9f' + // half width Katakana
          '\\uffa1-\\uffdc'; // half width Hangul (Korean)
        const alphaNumericRegExp = '0-9\_' + alphaCharsRegExp;
        const emojiRegExp = '\\u0023\\u20E3|\\u00a9|\\u00ae|\\u203c|\\u2049|\\u2139|[\\u2194-\\u2199]|\\u21a9|\\u21aa|\\u231a|\\u231b|\\u23e9|[\\u23ea-\\u23ec]|\\u23f0|\\u24c2|\\u25aa|\\u25ab|\\u25b6|\\u2611|\\u2614|\\u26fd|\\u2705|\\u2709|[\\u2795-\\u2797]|\\u27a1|\\u27b0|\\u27bf|\\u2934|\\u2935|[\\u2b05-\\u2b07]|\\u2b1b|\\u2b1c|\\u2b50|\\u2b55|\\u3030|\\u303d|\\u3297|\\u3299|[\\uE000-\\uF8FF\\u270A-\\u2764\\u2122\\u25C0\\u25FB-\\u25FE\\u2615\\u263a\\u2648-\\u2653\\u2660-\\u2668\\u267B\\u267F\\u2693\\u261d\\u26A0-\\u26FA\\u2708\\u2702\\u2601\\u260E]|[\\u2600\\u26C4\\u26BE\\u23F3\\u2764]|\\uD83D[\\uDC00-\\uDFFF]|\\uD83C[\\uDDE8-\\uDDFA\uDDEC]\\uD83C[\\uDDEA-\\uDDFA\uDDE7]|[0-9]\\u20e3|\\uD83C[\\uDC00-\\uDFFF]';
        const urlRegExp = '((?:https?|ftp)://|mailto:)?' +
        // user:pass authentication
        '(?:\\S{1,64}(?::\\S{0,64})?@)?' +
        '(?:' +
        // sindresorhus/ip-regexp
        '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}' +
        '|' +
        // host name
        '[' + alphaCharsRegExp + '0-9][' + alphaCharsRegExp + domainAddChars + '0-9\-]{0,64}' +
        // domain name
        '(?:\\.[' + alphaCharsRegExp + '0-9][' + alphaCharsRegExp + domainAddChars + '0-9\-]{0,64}){0,10}' +

        // TLD identifier
        '(?:\\.(xn--[0-9a-z]{2,16}|[' + alphaCharsRegExp + ']{2,24}))' +
        ')' +
        // port number
        '(?::\\d{2,5})?' +
        // resource path
        '(?:/(?:\\S{0,255}[^\\s.;,(\\[\\]{}<>"\'])?)?'
        const usernameRegExp = '[a-zA-Z\\d_]{5,32}';
        const emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const botCommandRegExp = '\\/([a-zA-Z\\d_]{1,32})(?:@(' + usernameRegExp + '))?(\\b|$)';
        const fullRegExp = new RegExp('(^| )(@)(' + usernameRegExp + ')|(' + urlRegExp + ')|(\\n)|(' + emojiRegExp + ')|(^|[\\s\\(\\]])(#[' + alphaNumericRegExp + ']{2,64})|(^|\\s)' + botCommandRegExp, 'i');
    
        options = options || {}

        var match
        var raw = text, url;
        var entities = [],
        emojiCode,
        emojiCoords,
        matchIndex
        var rawOffset = 0;

        while ((match = raw.match(fullRegExp))) {
            matchIndex = rawOffset + match.index;

            if (match[3]) { // mentions
                entities.push(this.textEntity(
                    'textEntityTypeMention', 
                    matchIndex + match[1].length,
                    match[2].length + match[3].length
                ));
            } else if (match[4]) {
                if (emailRegExp.test(match[4])) { // email
                    entities.push(this.textEntity(
                        'textEntityTypeEmailAddress', 
                        matchIndex,
                        match[4].length
                    ));
                } else {
                    var url = false
                    var protocol = match[5]
                    var tld = match[6]
                    var excluded = ''

                    if (tld) { // URL
                        if (!protocol && (tld.substr(0, 4) === 'xn--' || TLD.indexOf(tld.toLowerCase()) !== -1)) {
                            protocol = 'http://'
                        }

                        if (protocol) {
                            function checkBrackets (url) {
                                var urlLength = url.length
                                var urlOpenBrackets = url.split('(').length - 1
                                var urlCloseBrackets = url.split(')').length - 1

                                while (urlCloseBrackets > urlOpenBrackets &&
                                    url.charAt(urlLength - 1) === ')') {
                                    url = url.substr(0, urlLength - 1);
                                    urlCloseBrackets--;
                                    urlLength--;
                                }
                                if (urlOpenBrackets > urlCloseBrackets) {
                                    url = url.replace(/\)+$/, '');
                                }
                                return url;
                            }
                            var balanced = checkBrackets(match[4])

                            if (balanced.length !== match[4].length) {
                                excluded = match[4].substring(balanced.length)
                                match[4] = balanced
                            }

                            url = (match[5] ? '' : protocol) + match[4]
                        }
                    } else { // IP address
                        url = (match[5] ? '' : 'http://') + match[4]
                    }

                    if (url) {
                        entities.push(this.textEntity(
                            'textEntityTypeUrl', 
                            matchIndex,
                            match[4].length
                        ));
                    }
                }
            } else if (match[7]) { // New line
                // entities.push(this.textEntity(
                //     'textEntityTypeLinebreak', 
                //     matchIndex,
                //     1
                // ));
            } else if (match[8]) { // Emoji
                // if ((emojiCode = EmojiHelper.emojiMap[match[8]]) &&
                //   (emojiCoords = getEmojiSpritesheetCoords(emojiCode))) {
                //     entities.push({
                //         _: 'messageEntityEmoji',
                //         offset: matchIndex,
                //         length: match[0].length,
                //         coords: emojiCoords,
                //         title: emojiData[emojiCode][1][0]
                //     })
                // }
            } else if (match[10]) { // Hashtag
                entities.push(this.textEntity(
                    'textEntityTypeHashtag', 
                    matchIndex + match[9].length,
                    match[10].length
                ));
            } else if (match[12]) { // Bot command
                entities.push(this.textEntity(
                    'textEntityTypeBotCommand', 
                    matchIndex + match[11].length,
                    1 + match[12].length + (match[13] ? 1 + match[13].length : 0)
                ));
            }
            raw = raw.substr(match.index + match[0].length)
            rawOffset += match.index + match[0].length
        }

        return entities;
    };
    parseMarkdown = (text, entities, noTrim) => {
        const markdownEntities = {
            '`': 'textEntityTypeCode',
            '**': 'textEntityTypeBold',
            '__': 'textEntityTypeItalic'
        }
        const markdownTestRegExp = /[`_*@]/;
        const markdownRegExp = /(^|\s|\n)(````?)([\s\S]+?)(````?)([\s\n\.,:?!;]|$)|(^|\s)(`|\*\*|__)([^\n]+?)\7([\s\.,:?!;]|$)|@(\d+)\s*\((.+?)\)/m;

        if (!markdownTestRegExp.test(text)) {
            return noTrim ? text : text.trim()
        }
        var raw = text
        var match
        var newText = []
        var rawOffset = 0
        var matchIndex
        while (match = raw.match(markdownRegExp)) {
            matchIndex = rawOffset + match.index
            newText.push(raw.substr(0, match.index))

            var text = (match[3] || match[8] || match[11])
            rawOffset -= text.length
            text = text.replace(/^\s+|\s+$/g, '')
            rawOffset += text.length

            if (text.match(/^`*$/)) {
                newText.push(match[0])
            } else if (match[3]) { // pre
                if (match[5] == '\n') {
                    match[5] = ''
                    rawOffset -= 1
                }
                newText.push(match[1] + text + match[5])

                entities.push(this.textEntity(
                    'textEntityTypePre', 
                    matchIndex + match[1].length,
                    text.length,
                    {language: ''}
                ));
                rawOffset -= match[2].length + match[4].length
            } else if (match[7]) { // code|italic|bold
                newText.push(match[6] + text + match[9])

                entities.push(this.textEntity(
                    markdownEntities[match[7]], 
                    matchIndex + match[6].length,
                    text.length
                ));
                rawOffset -= match[7].length * 2
            } else if (match[11]) { // custom mention
                newText.push(text)
                entities.push(this.textEntity(
                    'textEntityTypeMentionName', 
                    matchIndex,
                    text.length,
                    {user_id: match[10]}
                ));
                rawOffset -= match[0].length - text.length
            }
            raw = raw.substr(match.index + match[0].length)
            rawOffset += match.index + match[0].length
        }
        newText.push(raw)
        newText = newText.join('')

        if (!newText.replace(/\s+/g, '').length) {
            newText = text
            entities.splice(0, entities.length)
        }
        if (!entities.length && !noTrim) {
            newText = newText.trim()
        }
        return newText
    };


    handleAttachPoll = () => {
        TdLibController.clientUpdate({
            '@type': 'clientUpdateNewPoll'
        });
    };

    handleAttachPhoto = () => {
        if (!this.attachPhotoRef) return;

        this.attachPhotoRef.current.click();
    };

    handleAttachPhotoComplete = () => {
        let files = this.attachPhotoRef.current.files;
        if (files.length === 0) return;

        Array.from(files).forEach(file => {
            readImageSize(file, result => {
                this.handleSendPhoto(result);
            });
        });

        this.attachPhotoRef.current.value = '';
    };

    handleAttachDocument = () => {
        if (!this.attachDocumentRef) return;

        this.attachDocumentRef.current.click();
    };

    handleAttachDocumentComplete = () => {
        let files = this.attachDocumentRef.current.files;
        if (files.length === 0) return;

        Array.from(files).forEach(file => {
            this.handleSendDocument(file);
        });

        this.attachDocumentRef.current.value = '';
    };

    getInputText() {
        let innerText = this.newMessageRef.current.innerText;
        let innerHTML = this.newMessageRef.current.innerHTML;

        if (innerText && innerText === '\n' && innerHTML && (innerHTML === '<br>' || innerHTML === '<div><br></div>')) {
            this.newMessageRef.current.innerHTML = '';
        }

        return innerText;
    }

    handleKeyUp = () => {
        const { chatId } = this.state;

        if (isMeChat(chatId)) return;

        const chat = ChatStore.get(chatId);
        if (!chat) return;

        const innerText = this.newMessageRef.current.innerText;
        const innerHTML = this.newMessageRef.current.innerHTML;

        if (innerText && innerText === '\n' && innerHTML && (innerHTML === '<br>' || innerHTML === '<div><br></div>')) {
            this.newMessageRef.current.innerHTML = '';
        }

        if (!innerText) return;

        const typingManager = chat.OutputTypingManager || (chat.OutputTypingManager = new OutputTypingManager(chat.id));

        typingManager.setTyping({ '@type': 'chatActionTyping' });
    };

    handleKeyDown = e => {
        const innerText = this.newMessageRef.current.innerText;
        const innerHTML = this.newMessageRef.current.innerHTML;
        this.innerHTML = innerHTML;

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSubmit();
        }
    };

    handleSendPhoto = file => {
        if (!file) return;

        const content = {
            '@type': 'inputMessagePhoto',
            photo: { '@type': 'inputFileBlob', name: file.name, data: file },
            width: file.photoWidth,
            height: file.photoHeight
        };

        this.onSendInternal(content, true, result => {
            const cachedMessage = MessageStore.get(result.chat_id, result.id);
            if (cachedMessage != null) {
                this.handleSendingMessage(cachedMessage, file);
            }

            FileStore.uploadFile(result.content.photo.sizes[0].photo.id, result);
        });
    };

    handleSendPoll = poll => {
        this.onSendInternal(poll, true, () => {});
    };

    handleSendDocument = file => {
        if (!file) return;

        const content = {
            '@type': 'inputMessageDocument',
            document: { '@type': 'inputFileBlob', name: file.name, data: file }
        };

        this.onSendInternal(content, true, result => FileStore.uploadFile(result.content.document.document.id, result));
    };

    handlePaste = event => {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;

        const files = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind.indexOf('file') === 0) {
                files.push(items[i].getAsFile());
            }
        }

        if (files.length > 0) {
            event.preventDefault();

            this.files = files;
            this.setState({ openPasteDialog: true });
            return;
        }

        const plainText = event.clipboardData.getData('text/plain');
        if (plainText) {
            event.preventDefault();
            document.execCommand('insertHTML', false, plainText);
            this.innerHTML = plainText;
            return;
        }
    };

    handlePasteContinue = () => {
        this.handleClosePaste();

        const files = this.files;
        if (!files) return;
        if (!files.length) return;

        files.forEach(file => {
            this.handleSendDocument(file);
        });

        this.files = null;
    };

    handleClosePaste = () => {
        this.setState({ openPasteDialog: false });
    };

    handleSendingMessage = (message, blob) => {
        if (message && message.sending_state && message.sending_state['@type'] === 'messageSendingStatePending') {
            if (message.content && message.content['@type'] === 'messagePhoto' && message.content.photo) {
                let size = getSize(message.content.photo.sizes, PHOTO_SIZE);
                if (!size) return;

                let file = size.photo;
                if (file && file.local && file.local.is_downloading_completed && !file.blob) {
                    file.blob = blob;
                    FileStore.updatePhotoBlob(message.chat_id, message.id, file.id);
                }
            }
        }
    };

    onSendInternal = async (content, clearDraft, callback) => {
        const { chatId, replyToMessageId } = this.state;

        if (!chatId) return;
        if (!content) return;

        try {
            await ApplicationStore.invokeScheduledAction(`clientUpdateClearHistory chatId=${chatId}`);

            let result = await TdLibController.send({
                '@type': 'sendMessage',
                chat_id: chatId,
                reply_to_message_id: replyToMessageId,
                input_message_content: content
            });

            this.setState({ replyToMessageId: 0 }, () => {
                if (clearDraft) {
                    const newChatDraftMessage = this.getNewChatDraftMessage(
                        this.state.chatId,
                        this.state.replyToMessageId
                    );
                    this.setChatDraftMessage(newChatDraftMessage);
                }
            });
            //MessageStore.set(result);

            TdLibController.send({
                '@type': 'viewMessages',
                chat_id: chatId,
                message_ids: [result.id]
            });

            callback(result);
        } catch (error) {
            alert('sendMessage error ' + JSON.stringify(error));
        }
    };

    handleEmojiSelect = emoji => {
        if (!emoji) return;

        this.newMessageRef.current.innerText += emoji.native;
        this.handleInput();
    };

    handleInput = async event => {
        const innerText = this.newMessageRef.current.innerText;
        if (!innerText || innerText.length > 11) {
            const { hint } = StickerStore;
            if (hint) {
                TdLibController.clientUpdate({
                    '@type': 'clientUpdateLocalStickersHint',
                    hint: null
                });
            }

            return;
        }

        const t0 = performance.now();
        const regex = emojiRegex();
        let match = regex.exec(innerText);
        const t1 = performance.now();
        console.log('Matched ' + (t1 - t0) + 'ms', match);
        if (!match || innerText !== match[0]) {
            const { hint } = StickerStore;
            if (hint) {
                TdLibController.clientUpdate({
                    '@type': 'clientUpdateLocalStickersHint',
                    hint: null
                });
            }

            return;
        }

        const timestamp = Date.now();
        TdLibController.send({
            '@type': 'getStickers',
            emoji: match[0],
            limit: 100
        }).then(stickers => {
            TdLibController.clientUpdate({
                '@type': 'clientUpdateLocalStickersHint',
                hint: {
                    timestamp,
                    emoji: match[0],
                    stickers
                }
            });
        });

        TdLibController.send({
            '@type': 'searchStickers',
            emoji: match[0],
            limit: 100
        }).then(stickers => {
            TdLibController.clientUpdate({
                '@type': 'clientUpdateRemoteStickersHint',
                hint: {
                    timestamp,
                    emoji: match[0],
                    stickers
                }
            });
        });
    };

    render() {
        const { classes, t } = this.props;
        const { chatId, replyToMessageId, openPasteDialog } = this.state;

        const content = this.innerHTML !== null ? this.innerHTML : null;

        return (
            <>
                <div className={classNames(classes.borderColor, 'inputbox')}>
                    <InputBoxHeader chatId={chatId} messageId={replyToMessageId} />
                    <div className='inputbox-wrapper'>
                        <div className='inputbox-left-column'>
                            <React.Suspense
                                fallback={
                                    <IconButton className={classes.iconButton} aria-label='Emoticon'>
                                        <InsertEmoticonIcon />
                                    </IconButton>
                                }>
                                <EmojiPickerButton onSelect={this.handleEmojiSelect} />
                            </React.Suspense>
                        </div>
                        <div className='inputbox-middle-column'>
                            <div
                                id='inputbox-message'
                                ref={this.newMessageRef}
                                key={new Date()}
                                placeholder={t('Message')}
                                contentEditable
                                suppressContentEditableWarning
                                onKeyDown={this.handleKeyDown}
                                onKeyUp={this.handleKeyUp}
                                onPaste={this.handlePaste}
                                onInput={this.handleInput}>
                                {content}
                            </div>
                        </div>
                        <div className='inputbox-right-column'>
                            <input
                                ref={this.attachDocumentRef}
                                className='inputbox-attach-button'
                                type='file'
                                multiple='multiple'
                                onChange={this.handleAttachDocumentComplete}
                            />
                            <input
                                ref={this.attachPhotoRef}
                                className='inputbox-attach-button'
                                type='file'
                                multiple='multiple'
                                accept='image/*'
                                onChange={this.handleAttachPhotoComplete}
                            />
                            <AttachButton
                                chatId={chatId}
                                onAttachPhoto={this.handleAttachPhoto}
                                onAttachDocument={this.handleAttachDocument}
                                onAttachPoll={this.handleAttachPoll}
                            />

                            {/*<IconButton>*/}
                            {/*<KeyboardVoiceIcon />*/}
                            {/*</IconButton>*/}
                            <IconButton className={classes.iconButton} aria-label='Send' onClick={this.handleSubmit}>
                                <SendIcon />
                            </IconButton>
                        </div>
                    </div>
                </div>
                {!isPrivateChat(chatId) && <CreatePollDialog onSend={this.handleSendPoll} />}
                <Dialog
                    transitionDuration={0}
                    open={openPasteDialog}
                    onClose={this.handleClosePaste}
                    aria-labelledby='delete-dialog-title'>
                    <DialogTitle id='delete-dialog-title'>{t('AppName')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.files && this.files.length > 1
                                ? 'Are you sure you want to send files?'
                                : 'Are you sure you want to send file?'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClosePaste} color='primary'>
                            {t('Cancel')}
                        </Button>
                        <Button onClick={this.handlePasteContinue} color='primary'>
                            {t('Ok')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

const enhance = compose(
    withStyles(styles, { withTheme: true }),
    withTranslation()
);

export default enhance(InputBoxControl);
