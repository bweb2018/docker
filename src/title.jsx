import Alert from 'react-s-alert';
import FileSaver from 'file-saver';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as yaml from 'js-yaml';

import gelato from './gelato/lib/index';
import Button from './components/button';
import * as Models from './models';
import { configPostLoad, configPreSave } from './config-utils';

export default class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.fileInput = React.createRef();
    this.handleFiles = this.handleFiles.bind(this);
  }

  handleFiles() {
    const { onUpdate } = this.props;
    const file = this.fileInput.current.files[0];
    if (file) {
      this.setState({
        loading: true,
      });
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = yaml.safeLoad(e.target.result);
          // TODO: validation
          onUpdate(configPostLoad(data));
        } catch (ex) {
          Alert.error(`The imported file is invalid: ${ex}`, { position: 'bottom-right' });
        }
        this.fileInput.current.value = null;
        this.setState({
          loading: false,
        });
      };
      reader.readAsText(file);
    }
  }

  render() {
    const {
      config, onReset, onSwitchContent, invalid,
    } = this.props;
    const { loading } = this.state;
    return (
      <div className="f3  h3 bg-white">
        <div className="pa3 flex justify-between items-center mw9" style={{ margin: '0 auto' }}>
          <div>Project Title</div>
          <div className="f5">
            <Button
              dark
              onClick={onReset}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              dark
              onClick={() => { this.fileInput.current.click(); }}
              disabled={loading}
            >
              Import Config
            </Button>
            <input
              ref={this.fileInput}
              type="file"
              accept="text/x-yaml|application/json"
              style={{ display: 'none' }}
              onChange={this.handleFiles}
            />
            <Button
              dark
              onClick={() => {
                const blob = new Blob([yaml.safeDump(configPreSave(config))], { type: 'text/x-yaml' });
                FileSaver.saveAs(blob, `${config.general.name}.yaml`);
              }}
            >
              Export Config
            </Button>
            <Button
              dark
              className="dn"
              disabled={invalid}
              onClick={() => {
                try {
                  onSwitchContent({
                    type: 'edit_dockerfile',
                    text: gelato(configPreSave(config)),
                  });
                } catch (ex) {
                  Alert.error(`An error occured while generating Dockerfile: ${ex}`, { position: 'bottom-right' });
                }
              }}
            >
              Generate Dockerfile
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Title.propTypes = {
  config: Models.config.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onSwitchContent: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
};

Title.defaultProps = {
  invalid: false,
};
