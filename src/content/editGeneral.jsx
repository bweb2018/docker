import { cloneDeep } from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import * as Models from '../models';
import SettingsEditor from '../settingsEditor';
import * as Settings from './settings';

export default class EditGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(generalUpdate) {
    const { config, onUpdate } = this.props;
    onUpdate({ general: { ...cloneDeep(config.general), ...generalUpdate } });
  }

  render() {
    const { config } = this.props;
    return (
      <div className="ph4 bg-white pa3 pt0 f7">
        <SettingsEditor
          settings={Settings.general}
          value={config.general}
          onUpdate={this.onChange}
        />
      </div>
    );
  }
}

EditGeneral.propTypes = {
  config: Models.config.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
