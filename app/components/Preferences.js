import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

import { translate } from '../utils/localizationUtil';
import * as settingsActions from '../actions/settingsActions';
import SettingsUtil from '../utils/SettingsUtil';

@connect(store => {
  return {
    autoPath: store.settingsReducer.autoPath,
    connectLaunch: store.settingsReducer.connectLaunch,
    disableSmartdns: store.settingsReducer.disableSmartdns,
    encryption: store.settingsReducer.encryption,
    launchStartup: store.settingsReducer.launchStartup,
    launchStartupHidden: store.settingsReducer.launchStartupHidden,
    metricsEnabled: store.settingsReducer.metricsEnabled,
    minToTaskbar: store.settingsReducer.minToTaskbar,
    saveCredentials: store.settingsReducer.saveCredentials
  }
})
export default class Preferences extends Component {

  static propTypes = {
    autoPath: PropTypes.bool.isRequired,
    connectLaunch: PropTypes.bool.isRequired,
    disableSmartdns: PropTypes.bool.isRequired,
    encryption: PropTypes.object.isRequired,
    launchStartup: PropTypes.bool.isRequired,
    launchStartupHidden: PropTypes.bool.isRequired,
    metricsEnabled: PropTypes.bool.isRequired,
    minToTaskbar: PropTypes.bool.isRequired,
    saveCredentials: PropTypes.bool.isRequired
  };

  handleChangeAutoPath() {
    this.props.dispatch(settingsActions.toggleAutoPath(this.props.autoPath));
    SettingsUtil.save('autoPath', this.props.autoPath);
  }

  handleChangeConnectLaunch() {
    this.props.dispatch(settingsActions.toggleConnectLaunch(this.props.connectLaunch));
    SettingsUtil.save('connectLaunch', this.props.connectLaunch);
  }

  handleChangeDisableSmartdns() {
    this.props.dispatch(settingsActions.toggleSmartDNS(this.props.disableSmartdns));
    SettingsUtil.save('disableSmartdns', this.props.disableSmartdns);
  }

  handleEncryptionChange(encryption) {
    this.props.dispatch(settingsActions.changeEncryption(encryption));
    SettingsUtil.save('encryption', encryption);
  }

  handleChangeLaunchStartup() {
    this.props.dispatch(settingsActions.toggleLaunchStartup(this.props.launchStartup));
    SettingsUtil.save('launchStartup', this.props.launchStartup);
  }

  handleChangeLaunchStartupHidden() {
    this.props.dispatch(settingsActions.toggleStartupHidden(this.props.launchStartupHidden));
    SettingsUtil.save('launchStartupHidden', this.props.launchStartupHidden);
  }

  handleChangeMetricsEnabled() {
    this.props.dispatch(settingsActions.toggleMetrics(this.props.metricsEnabled));
    SettingsUtil.save('metricsEnabled', this.props.metricsEnabled);
  }

  handleChangeMinToTaskbar() {
    this.props.dispatch(settingsActions.toggleMinTaskbar(this.props.minToTaskbar));
    SettingsUtil.save('minToTaskbar', this.props.minToTaskbar);
  }

  render() {
    let encryptions;
    let ports;

    if (this.props.autoPath) {
      encryptions = [{
          value: 128,
          label: '128 BIT AES'
        }, {
          value: 256,
          label: '256 BIT AES'
        }];
    } else {
      encryptions = [{
          value: 64,
          label: '64 BIT BLOWFISH'
        }, {
          value: 128,
          label: '128 BIT AES'
        }, {
          value: 256,
          label: '256 BIT AES'
        }];
    }

    if (this.props.encryption.value === 64) {
      ports = [{
          value: 'default',
          label: 'UDP - Default'
        }];
    } else if (this.props.encryption.value === 128) {
      ports = [{
          value: 'default',
          label: 'UDP - Default'
        }, {
          value: 53,
          label: 'UDP - 53'
        }, {
          value: 443,
          label: 'TCP - 443'
        }, {
          value: 80,
          label: 'TCP - 80'
        }];
    } else if (this.props.encryption.value === 256) {
      ports = [{
          value: 'default',
          label: 'UDP - Default'
        }, {
          value: 3389,
          label: 'UDP - 3389'
        }];
    }

    let customPort;
    if (!this.props.autoPath) {
      customPort = (
        <section className="preferences">
          <h1 className="title">{translate('Custom Port')}</h1>
          <div className="selectbox">
            <Select name="customPort" value={this.props.customPort} options={ports} searchable={false} clearable={false} />
          </div>
        </section>
      );
    }

    const autoPathStatus = this.props.autoPath ? 'Enabled' : 'Disabled'

    return (
      <div className="content-scroller" id="content">

        <section>
          <h1 className="title">{translate('General')}</h1>
          <div className="checkbox">
            <input id="reportAnon" type="checkbox" checked={this.props.metricsEnabled} onChange={this.handleChangeMetricsEnabled.bind(this)} />
            <label htmlFor="reportAnon" />
            <p>{translate('Report anonymous usage analytics')}</p>
          </div>
          <div className="checkbox">
            <input id="saveCredentials" disabled={!this.props.saveCredentials} type="checkbox" checked={this.props.connectLaunch && this.props.saveCredentials} onChange={this.handleChangeConnectLaunch.bind(this)} />
            <label htmlFor="saveCredentials" />
            <p>{translate('Auto-connect after launch (requires a saved user/pass)')}</p>
          </div>
          <div className="checkbox">
            <input id="launchStartup" type="checkbox" checked={this.props.launchStartup} onChange={this.handleChangeLaunchStartup.bind(this)} />
            <label htmlFor="launchStartup" />
            <p>{translate(' on operating system startup')}</p>
          </div>
          <div className="checkbox">
            <input id="launchStartupHidden" type="checkbox" checked={this.props.launchStartupHidden} onChange={this.handleChangeLaunchStartupHidden.bind(this)} />
            <label htmlFor="launchStartupHidden" />
            <p>{translate(' on operating system startup hidden')}</p>
          </div>
          <div className="checkbox">
            <input id="disableSmartdns" type="checkbox" checked={this.props.disableSmartdns} onChange={this.handleChangeDisableSmartdns.bind(this)} />
            <label htmlFor="disableSmartdns" />
            <p>{translate('Disable SmartDNS')}</p>
          </div>
          <div className="checkbox">
            <input id="minToTaskbar" type="checkbox" checked={this.props.minToTaskbar} onChange={this.handleChangeMinToTaskbar.bind(this)} />
            <label htmlFor="minToTaskbar" />
            <p>{translate('Minimize to taskbar')}</p>
          </div>
        </section>

        <section className="preferences">
          <h1 className="title">{translate('Encryption')}</h1>
          <div className="selectbox">
            <Select
              name="encryption"
              value={this.props.encryption}
              options={encryptions}
              onChange={this.handleEncryptionChange.bind(this)}
              searchable={false}
              clearable={false}
            />
          </div>
        </section>

        {customPort}

        <section className="preferences">
          <h1 className="title">{translate('Auto Path')}</h1>
          <div className="checkbox">
            <input className="autopath" type="checkbox" id="autopath" checked={this.props.autoPath} onChange={this.handleChangeAutoPath.bind(this)} />
            <label htmlFor="autopath" />
            <p>{translate(autoPathStatus)}</p>
            <p className="info">{translate('Feature that tries alternate ports in order to resolve certain types of connections issues.')}</p>
          </div>
        </section>

      </div>
    );
  }

}
