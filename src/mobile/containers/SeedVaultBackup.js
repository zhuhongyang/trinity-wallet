import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { width, height } from '../utils/dimensions';
import DynamicStatusBar from '../components/DynamicStatusBar';
import OnboardingButtons from '../containers/OnboardingButtons';
import { Icon } from '../theme/icons.js';
import Header from '../components/Header';
import { leaveNavigationBreadcrumb } from '../utils/bugsnag';
import StatefulDropdownAlert from './StatefulDropdownAlert';
import SeedVaultExportComponent from '../components/SeedVaultExportComponent';
import { isAndroid } from '../utils/device';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: height / 16,
    },
    midContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: height / 16,
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});

/** Seed Vault Backup component */
class SeedVaultBackup extends Component {
    static propTypes = {
        /** Navigation object */
        navigator: PropTypes.object.isRequired,
        /** @ignore */
        t: PropTypes.func.isRequired,
        /** @ignore */
        theme: PropTypes.object.isRequired,
        /** @ignore */
        seed: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            step: 'isViewingGeneralInfo',
            seed: props.seed,
        };
    }

    componentDidMount() {
        leaveNavigationBreadcrumb('SeedVaultBackup');
    }

    /**
     * Determines course of action on right button press dependent on current progress step
     *
     * @method onRightButtonPress
     */
    onRightButtonPress() {
        const { step } = this.state;
        if (step === 'isExporting' && !isAndroid) {
            return this.SeedVaultExportComponent.onExportPress();
        } else if (step === 'isSelectingSaveMethodAndroid') {
            return this.goBack();
        }
        this.SeedVaultExportComponent.onNextPress();
    }

    /**
     * Navigates back to SeedBackupOptions
     *
     * @method goBack
     */
    goBack() {
        const { theme: { body } } = this.props;
        this.props.navigator.pop({
            navigatorStyle: {
                navBarHidden: true,
                navBarTransparent: true,
                topBarElevationShadowEnabled: false,
                screenBackgroundColor: body.bg,
                drawUnderStatusBar: true,
                statusBarColor: body.bg,
            },
            animated: false,
        });
    }

    render() {
        const { t, theme: { body } } = this.props;
        const { step, seed } = this.state;

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.container, { backgroundColor: body.bg }]}>
                    <View>
                        <DynamicStatusBar backgroundColor={body.bg} />
                        <View style={styles.topContainer}>
                            <Icon name="iota" size={width / 8} color={body.color} />
                            <View style={{ flex: 0.7 }} />
                            <Header textColor={body.color}>{t('exportSeedVault')}</Header>
                        </View>
                        <KeyboardAvoidingView behavior="padding" style={styles.midContainer}>
                            <SeedVaultExportComponent
                                step={step}
                                setProgressStep={(step) => this.setState({ step })}
                                goBack={() => this.goBack()}
                                onRef={(ref) => {
                                    this.SeedVaultExportComponent = ref;
                                }}
                                isAuthenticated
                                seed={seed}
                                setSeed={(seed) => this.setState({ seed })}
                            />
                        </KeyboardAvoidingView>
                        <View style={styles.bottomContainer}>
                            <OnboardingButtons
                                onLeftButtonPress={() => this.SeedVaultExportComponent.onBackPress()}
                                onRightButtonPress={() => this.onRightButtonPress()}
                                leftButtonText={t('global:back')}
                                rightButtonText={
                                    step === 'isExporting' && !isAndroid
                                        ? t('global:export')
                                        : step === 'isSelectingSaveMethodAndroid' ? t('global:done') : t('global:next')
                                }
                            />
                        </View>
                    </View>
                    <StatefulDropdownAlert textColor={body.color} backgroundColor={body.bg} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = (state) => ({
    seed: state.wallet.seed,
    theme: state.settings.theme,
});

export default translate(['seedVault', 'global'])(connect(mapStateToProps, null)(SeedVaultBackup));
