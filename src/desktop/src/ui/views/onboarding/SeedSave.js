import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate, Trans } from 'react-i18next';
import { connect } from 'react-redux';

import { getChecksum } from 'libs/iota/utils';

import Modal from 'ui/components/modal/Modal';
import Button from 'ui/components/Button';
import Icon from 'ui/components/Icon';
import Clipboard from 'ui/components/Clipboard';

import paperWallet from 'themes/paper-wallet.svg';
import paperWalletFilled from 'themes/paper-wallet-filled.svg';

import css from './index.scss';

const wallets = {
    paperWallet: paperWallet,
    paperWalletFilled: paperWalletFilled,
};

/**
 * Onboarding, Seed backup step
 */
class SeedSave extends PureComponent {
    static propTypes = {
        /** Current user defined seed */
        seed: PropTypes.string,
        /** Translation helper
         * @param {string} translationString - locale string identifier to be translated
         * @ignore
         */
        t: PropTypes.func.isRequired,
    };

    state = {
        writeIndex: 1,
        writeVisible: false,
    };

    render() {
        const { t, seed } = this.props;
        const { writeIndex, writeVisible } = this.state;

        return (
            <form>
                <section className={css.wide}>
                    <h1>{t('saveYourSeed:saveYourSeed')}</h1>
                    <Trans i18nKey="saveYourSeed:mustSaveYourSeed">
                        <p>
                            You must save your seed with <strong>at least one</strong> of the options listed below.
                        </p>
                    </Trans>
                    <nav className={css.choice}>
                        <Clipboard
                            text={seed || ''}
                            timeout={60}
                            title={t('copyToClipboard:seedCopied')}
                            success={t('copyToClipboard:seedCopiedExplanation')}
                        >
                            <div>
                                <Icon icon="password" size={24} />
                            </div>
                            <h4>{t('saveYourSeed:digitalCopy')}</h4>
                            <p>{t('copyToClipboard')}</p>
                        </Clipboard>
                        <a onClick={() => this.setState({ writeVisible: true, writeIndex: 1 })} className={css.secure}>
                            <h3>{t('saveYourSeed:mostSecure')}</h3>
                            <div>
                                <Icon icon="write" size={24} />
                            </div>
                            <h4>{t('saveYourSeed:paperWallet')}</h4>
                            <p>{t('saveYourSeed:writeYourSeedDown')}</p>
                        </a>
                        <a onClick={() => window.print()}>
                            <div>
                                <Icon icon="print" size={24} />
                            </div>
                            <h4>{t('saveYourSeed:Printed')}</h4>
                            <p>{t('saveYourSeed:printYourSeed')}</p>
                        </a>
                    </nav>
                </section>
                <footer>
                    <Button to="/onboarding/seed-generate" className="square" variant="dark">
                        {t('goBackStep')}
                    </Button>
                    <Button to="/onboarding/seed-verify" className="square" variant="primary">
                        {t('saveYourSeed:iHaveSavedMySeed')}
                    </Button>
                </footer>
                <Modal variant="confirm" isOpen={writeVisible} onClose={() => this.setState({ writeVisible: false })}>
                    <section>
                        <h1>{t('saveYourSeed:letsWriteDownYourSeed')}</h1>
                        <p>{t('saveYourSeed:youCanHighlightCharacters')}</p>
                        <div className={classNames(css.seed, css.narrow)}>
                            <div>
                                {seed &&
                                    seed.match(/.{1,3}/g).map((letter, index) => {
                                        return (
                                            <span
                                                className={
                                                    writeIndex !== Math.floor(index / 3) + 1 ? css.disabled : null
                                                }
                                                key={`${index}${letter}`}
                                            >
                                                {index % 3 === 0 ? <em>{index / 3 + 1}</em> : null}
                                                {letter}
                                            </span>
                                        );
                                    })}
                            </div>
                        </div>
                        <nav className={css.steps}>
                            <a
                                onClick={() => this.setState({ writeIndex: writeIndex - 1 })}
                                className={writeIndex === 1 ? css.disabled : null}
                            >
                                <Icon icon="arrowLeft" size={38} />
                                {t('prev')}
                            </a>
                            <span>{writeIndex}/9</span>
                            <a
                                onClick={() => this.setState({ writeIndex: writeIndex + 1 })}
                                className={writeIndex === 9 ? css.disabled : null}
                            >
                                <Icon icon="arrowRight" size={38} />
                                {t('next')}
                            </a>
                        </nav>
                    </section>
                    <footer>
                        <Button onClick={() => window.print()} variant="secondary">
                            {t('saveYourSeed:printBlankWallet')}
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({ writeVisible: false });
                            }}
                            variant="primary"
                        >
                            {t('done')}
                        </Button>
                    </footer>
                </Modal>
                <div className={css.print} onClick={() => window.print()}>
                    <div>
                        {writeVisible ? null : (
                            <svg viewBox="0 0 595 841" xmlns="http://www.w3.org/2000/svg">
                                {seed &&
                                    seed.split('').map((letter, index) => {
                                        const space = index % 9 > 5 ? 38 : index % 9 > 2 ? 19 : 0;
                                        const x = 168 + (index % 9) * 26 + space;
                                        const y = 405 + Math.floor(index / 9) * 32.8;
                                        return (
                                            <text x={x} y={y} key={`${index}${letter}`}>
                                                {letter}
                                            </text>
                                        );
                                    })}
                                <text x="278" y="730">
                                    {getChecksum(seed)}
                                </text>
                            </svg>
                        )}
                    </div>
                    <img width="100%" height="100%" src={writeVisible ? paperWallet : wallets.paperWalletFilled} />
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state) => ({
    seed: state.ui.onboarding.seed,
});

export default connect(mapStateToProps)(translate()(SeedSave));
