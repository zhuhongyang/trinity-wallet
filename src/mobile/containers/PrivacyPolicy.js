import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { acceptPrivacy } from 'iota-wallet-shared-modules/actions/settings';
import i18next from '../i18next';
import Button from '../components/Button';
import GENERAL from '../theme/general';
import { width, height } from '../utils/dimensions';
import DynamicStatusBar from '../components/DynamicStatusBar';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: GENERAL.fontSize4,
        textAlign: 'center',
        paddingTop: height / 55,
    },
    pdf: {
        flex: 1,
        height: height - height / 8 - height / 11,
        width: width,
    },
    titleContainer: {
        height: height / 8,
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    placeholderText: {
        fontFamily: 'SourceSansPro-SemiBold',
        fontSize: GENERAL.fontSize3,
    },
});

/** Welcome screen component */
class PrivacyPolicy extends Component {
    static propTypes = {
        /** Navigation object */
        navigator: PropTypes.object.isRequired,
        /** Theme settings */
        theme: PropTypes.object.isRequired,
        /** User confirms that they agree to the privacy policy */
        acceptPrivacy: PropTypes.func.isRequired,
        /** Translation helper
         * @param {string} translationString - locale string identifier to be translated
         */
        t: PropTypes.func.isRequired,
    };

    static isCurrentLanguageGerman() {
        return i18next.language === 'de';
    }

    onNextPress() {
        const { theme } = this.props;
        this.props.acceptPrivacy();
        this.props.navigator.push({
            screen: 'welcome',
            navigatorStyle: {
                navBarHidden: true,
                navBarTransparent: true,
                topBarElevationShadowEnabled: false,
                screenBackgroundColor: theme.body.bg,
                drawUnderStatusBar: true,
                statusBarColor: theme.body.bg,
            },
            animated: false,
        });
    }

    render() {
        const { t, theme: { primary, body, bar } } = this.props;
        const textColor = { color: bar.color };

        return (
            <View style={[styles.container, { backgroundColor: body.bg }]}>
                <DynamicStatusBar backgroundColor={bar.bg} />
                <View style={[styles.titleContainer, { backgroundColor: bar.bg }]}>
                    <Text style={[styles.titleText, textColor]}>{t('privacyPolicy')}</Text>
                </View>
                <View style={styles.placeholderContainer}>
                    <Text style={[styles.placeholderText, textColor]}>PLACEHOLDER</Text>
                </View>
                <Button
                    onPress={() => this.onNextPress()}
                    style={{
                        wrapper: { backgroundColor: primary.color },
                        children: { color: primary.body },
                    }}
                >
                    {t('agree')}
                </Button>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.settings.theme,
});

const mapDispatchToProps = {
    acceptPrivacy,
};

export default translate('privacyPolicy')(connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy));