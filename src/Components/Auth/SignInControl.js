/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { isValidPhoneNumber } from '../../Utils/Common';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import OptionStore from '../../Stores/OptionStore';
import LocalizationStore from '../../Stores/LocalizationStore';
import TdLibController from '../../Controllers/TdLibController';
import MenuItem from '@material-ui/core/MenuItem';
import './SignInControl.css';

const styles = {
    button: {
        margin: '16px 0 0 0'
    },
    phone: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    continueAtLanguage: {
        transform: 'translateY(100px)',
        textAlign: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    }
};

const countryCodes = [
    ['AB', '+7 840'],
    ['AB', '+7 940'],
    ['AB', '+995 44'],
    ['AF', '+93'],
    ['AX', '+358 18'],
    ['AL', '+355'],
    ['DZ', '+213'],
    ['AS', '+1 684'],
    ['AD', '+376'],
    ['AO', '+244'],
    ['AI', '+1 264'],
    ['AG', '+1 268'],
    ['AR', '+54'],
    ['AM', '+374'],
    ['AW', '+297'],
    ['SH', '+247'],
    ['AU', '+61'],
    ['AU', '+672'],
    ['AT', '+43'],
    ['AZ', '+994'],
    ['BS', '+1 242'],
    ['BH', '+973'],
    ['BD', '+880'],
    ['BB', '+1 246'],
    ['AG', '+1 268'],
    ['BY', '+375'],
    ['BE', '+32'],
    ['BZ', '+501'],
    ['BJ', '+229'],
    ['BM', '+1 441'],
    ['BT', '+975'],
    ['BO', '+591'],
    ['BQ', '+599 7'],
    ['BA', '+387'],
    ['BW', '+267'],
    ['BR', '+55'],
    ['IO', '+246'],
    ['VG', '+1 284'],
    ['BN', '+673'],
    ['BG', '+359'],
    ['BF', '+226'],
    ['MY', '+95'],
    ['BI', '+257'],
    ['KH', '+855'],
    ['CM', '+237'],
    ['CA', '+1'],
    ['CV', '+238'],
    ['KY', '+1 345'],
    ['CF', '+236'],
    ['TD', '+235'],
    ['CL', '+56'],
    ['CN', '+86'],
    ['CX', '+61'],
    ['CC', '+61'],
    ['CO', '+57'],
    ['KM', '+269'],
    ['CG', '+242'],
    ['CD', '+243'],
    ['CK', '+682'],
    ['CR', '+506'],
    ['CI', '+225'],
    ['HR', '+385'],
    ['CU', '+53'],
    ['CW', '+599 9'],
    ['CY', '+357'],
    ['CZ', '+420'],
    ['DK', '+45'],
    ['DG', '+246'],
    ['DJ', '+253'],
    ['DM', '+1 767'],
    ['DO', '+1 809'],
    ['DO', '+1 829'],
    ['DO', '+1 849'],
    ['TL', '+670'],
    ['EC', '+593'],
    ['EG', '+20'],
    ['SV', '+503'],
    ['GQ', '+240'],
    ['ER', '+291'],
    ['EE', '+372'],
    ['ET', '+251'],
    ['FK', '+500'],
    ['FO', '+298'],
    ['FJ', '+679'],
    ['FI', '+358'],
    ['FR', '+33'],
    ['GF', '+594'],
    ['PF', '+689'],
    ['GA', '+241'],
    ['GM', '+220'],
    ['GE', '+995'],
    ['DE', '+49'],
    ['GH', '+233'],
    ['GI', '+350'],
    ['GR', '+30'],
    ['GL', '+299'],
    ['GD', '+1 473'],
    ['GP', '+590'],
    ['GU', '+1 671'],
    ['GT', '+502'],
    ['GG', '+44'],
    ['GN', '+224'],
    ['GW', '+245'],
    ['GY', '+592'],
    ['HT', '+509'],
    ['HN', '+504'],
    ['HK', '+852'],
    ['HU', '+36'],
    ['IS', '+354'],
    ['IN', '+91'],
    ['ID', '+62'],
    ['IR', '+98'],
    ['IQ', '+964'],
    ['IE', '+353'],
    ['IL', '+972'],
    ['IT', '+39'],
    ['JM', '+1 876'],
    ['SJ', '+47 79'],
    ['JP', '+81'],
    ['JE', '+44'],
    ['JO', '+962'],
    ['KZ', '+7 6'],
    ['KZ', '+7 7'],
    ['KE', '+254'],
    ['KI', '+686'],
    ['KP', '+850'],
    ['KR', '+82'],
    ['KW', '+965'],
    ['KG', '+996'],
    ['LA', '+856'],
    ['LV', '+371'],
    ['LB', '+961'],
    ['LS', '+266'],
    ['LR', '+231'],
    ['LY', '+218'],
    ['LI', '+423'],
    ['LT', '+370'],
    ['LU', '+352'],
    ['MO', '+853'],
    ['MK', '+389'],
    ['MG', '+261'],
    ['MW', '+265'],
    ['MY', '+60'],
    ['MV', '+960'],
    ['ML', '+223'],
    ['MT', '+356'],
    ['MH', '+692'],
    ['MQ', '+596'],
    ['MR', '+222'],
    ['MU', '+230'],
    ['YT', '+262'],
    ['MX', '+52'],
    ['FM', '+691'],
    ['MD', '+373'],
    ['MC', '+377'],
    ['MN', '+976'],
    ['ME', '+382'],
    ['MS', '+1 664'],
    ['MA', '+212'],
    ['MZ', '+258'],
    ['NA', '+264'],
    ['NR', '+674'],
    ['NP', '+977'],
    ['NL', '+31'],
    ['NC', '+687'],
    ['NZ', '+64'],
    ['NI', '+505'],
    ['NE', '+227'],
    ['NG', '+234'],
    ['NU', '+683'],
    ['NF', '+672'],
    ['MP', '+1 670'],
    ['NO', '+47'],
    ['OM', '+968'],
    ['PK', '+92'],
    ['PW', '+680'],
    ['PS', '+970'],
    ['PA', '+507'],
    ['PG', '+675'],
    ['PY', '+595'],
    ['PE', '+51'],
    ['PH', '+63'],
    ['PN', '+64'],
    ['PL', '+48'],
    ['PT', '+351'],
    ['PR', '+1 787'],
    ['PR', '+1 939'],
    ['QA', '+974'],
    ['RE', '+262'],
    ['RO', '+40'],
    ['RU', '+7'],
    ['RW', '+250'],
    ['BL', '+590'],
    ['SH', '+290'],
    ['KN', '+1 869'],
    ['LC', '+1 758'],
    ['MF', '+590'],
    ['PM', '+508'],
    ['VC', '+1 784'],
    ['WS', '+685'],
    ['SM', '+378'],
    ['ST', '+239'],
    ['SA', '+966'],
    ['SN', '+221'],
    ['RS', '+381'],
    ['SC', '+248'],
    ['SL', '+232'],
    ['SG', '+65'],
    ['BQ', '+599 3'],
    ['SX', '+1 721'],
    ['SK', '+421'],
    ['SI', '+386'],
    ['SB', '+677'],
    ['SO', '+252'],
    ['ZA', '+27'],
    ['GS', '+500'],
    ['GE_SO', '+995 34'],
    ['SS', '+211'],
    ['ES', '+34'],
    ['LK', '+94'],
    ['SD', '+249'],
    ['SR', '+597'],
    ['SJ', '+47 79'],
    ['SZ', '+268'],
    ['SE', '+46'],
    ['CH', '+41'],
    ['SY', '+963'],
    ['TW', '+886'],
    ['TJ', '+992'],
    ['TZ', '+255'],
    ['TH', '+66'],
    ['TG', '+228'],
    ['TK', '+690'],
    ['TO', '+676'],
    ['TT', '+1 868'],
    ['TN', '+216'],
    ['TR', '+90'],
    ['TM', '+993'],
    ['TC', '+1 649'],
    ['TV', '+688'],
    ['UG', '+256'],
    ['UA', '+380'],
    ['AE', '+971'],
    ['UK', '+44'],
    ['US', '+1'],
    ['UY', '+598'],
    ['VI', '+1 340'],
    ['UZ', '+998'],
    ['VU', '+678'],
    ['VE', '+58'],
    ['VA', '+39 06 698'],
    ['VA', '+379'],
    ['VN', '+84'],
    ['WF', '+681'],
    ['YE', '+967'],
    ['ZM', '+260'],
    ['TZ', '+255'],
    ['ZW', '+263']
];

class SignInControl extends React.Component {
    constructor(props) {
        super(props);

        TdLibController.send({
            '@type': 'getCountryCode'
        })
            .then(result => {
                let code = result.text;
                let foundCode = countryCodes.find(x => x[0] == code);
                if (foundCode) {
                    this.setState({ phoneCode: foundCode[1] });
                }
            })
            .catch(console.error);
    }

    state = {
        phoneCode: '+1',
        phoneNumber: '',
        error: null,
        loading: false
    };

    componentDidMount() {
        this.handleSuggestedLanguagePackId();

        window.addEventListener('keypress', this.handleKeyPress);
        OptionStore.on('updateOption', this.handleUpdateOption);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.handleKeyPress);
        OptionStore.removeListener('updateOption', this.handleUpdateOption);
    }

    handleUpdateOption = update => {
        const { name } = update;

        if (name === 'suggested_language_pack_id') {
            this.handleSuggestedLanguagePackId();
        }
    };

    handleSuggestedLanguagePackId = () => {
        const { i18n } = this.props;
        if (!i18n) return;

        const languagePackId = OptionStore.get('suggested_language_pack_id');
        if (!languagePackId) return;

        const { value } = languagePackId;
        if (value === i18n.language) {
            this.setState({ suggestedLanguage: null });
            return;
        }

        LocalizationStore.loadLanguage(value).then(() => {
            this.setState({ suggestedLanguage: value });
        });
    };

    // handleNext = () => {
    //     const { phone } = this.props;

    //     const phoneNumber = this.state.phoneCode + (this.state.phoneNumber || phone);
    //     if (isValidPhoneNumber(phoneNumber)) {
    //         this.setState({ error: null, openConfirmation: true });
    //     } else {
    //         this.setState({ error: { code: 'InvalidPhoneNumber' } });
    //     }
    // };

    handleChange = event => {
        this.setState({ phoneNumber: event.target.value });
    };

    handleKeyPress = event => {
        if (event.code == 'Enter') {
            event.preventDefault();
            this.handleDone();
        }
    };

    handleDone = () => {
        const { phone, onPhoneEnter, t } = this.props;

        const phoneNumber = this.state.phoneCode + (this.state.phoneNumber || phone);
        if (!isValidPhoneNumber(phoneNumber)) {
            this.setState({ error: { code: 'InvalidPhoneNumber' } });
            return;
        }

        onPhoneEnter(phoneNumber);
        this.setState({ error: null, loading: true });
        TdLibController.send({
            '@type': 'setAuthenticationPhoneNumber',
            phone_number: phoneNumber
        })
            .then(result => {})
            .catch(error => {
                console.error('setauthphonenumber');
                let errorString = null;
                if (error && error['@type'] === 'error' && error.message) {
                    errorString = error.message;
                } else {
                    errorString = JSON.stringify(error);
                }
                if (errorString == 'PHONE_NUMBER_INVALID') errorString = t('InvalidPhoneNumber');

                this.setState({ error: { string: errorString } });
            })
            .finally(() => {
                console.error('finally (loading=false)');
                this.setState({ loading: false });
            });
    };

    handleChangeLanguage = () => {
        const { i18n } = this.props;
        const { suggestedLanguage } = this.state;

        if (!i18n) return;
        if (!suggestedLanguage) return;

        this.setState({ suggestedLanguage: i18n.language });

        TdLibController.clientUpdate({ '@type': 'clientUpdateLanguageChange', language: suggestedLanguage });
    };
    onCountrySelect = e => {
        this.setState({ phoneCode: e.target.value });
    };
    onCodeType = e => {
        this.setState({ phoneCode: e.target.value });
    };

    render() {
        const { phone, classes, t, i18n } = this.props;
        const { loading, error, suggestedLanguage } = this.state;

        let errorString = '';
        if (error) {
            const { code, string } = error;
            if (code) {
                errorString = t(code);
            } else {
                errorString = string;
            }
        }

        const countryLang =
            Object.keys(LocalizationStore.i18n.store.data).indexOf(i18n.language) >= 0 ? i18n.language : 'en';
        const countriesItems = countryCodes.map((code, i) => (
            <MenuItem label={i} value={code[1]} key={i} name={code[0]}>
                {LocalizationStore.i18n.store.data[countryLang].countries[code[0]] + ' (' + code[1] + ')'}
            </MenuItem>
        ));

        return (
            <FormControl fullWidth>
                <div className='authorization-header'>
                    <span className='authorization-header-content'>{t('YourPhone')}</span>
                </div>
                <div>{t('StartText')}</div>
                <br />
                <Select
                    color='primary'
                    id='countrySelect'
                    label={t('Country')}
                    name='country'
                    onChange={this.onCountrySelect}
                    value={this.state.phoneCode.trim()}>
                    {countriesItems}
                </Select>
                <div>
                    <TextField
                        color='primary'
                        disabled={loading}
                        id='phoneCode'
                        margin='normal'
                        style={{ float: 'left', width: 70, overflow: 'hidden' }}
                        label={t('PhoneCode')}
                        value={this.state.phoneCode}
                        onChange={this.onCodeType}
                    />
                    <TextField
                        color='primary'
                        disabled={loading}
                        error={Boolean(errorString)}
                        autoFocus
                        id='phoneNumber'
                        label={t('PhoneNumber')}
                        margin='normal'
                        style={{ float: 'right', overflow: 'hidden', width: 'calc(100% - 90px)', marginLeft: 20 }}
                        onChange={this.handleChange}
                        value={this.state.phoneNumber}
                    />
                </div>
                <FormHelperText id='sign-in-error-text'>{errorString}</FormHelperText>
                <div className='sign-in-actions'>
                    <Button
                        fullWidth
                        color='primary'
                        disabled={loading}
                        className={classes.button}
                        onClick={this.handleDone}>
                        {t('Next')}
                    </Button>
                    <Typography className={classes.continueAtLanguage}>
                        <Link onClick={this.handleChangeLanguage}>
                            {Boolean(suggestedLanguage) ? t('ContinueOnThisLanguage', { lng: suggestedLanguage }) : ' '}
                        </Link>
                    </Typography>
                </div>
            </FormControl>
        );
    }
}

const enhance = compose(
    withTranslation(),
    withStyles(styles, { withTheme: true })
);

export default enhance(SignInControl);
