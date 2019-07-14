import memoizeOne from 'memoize-one';
import * as PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import ChoiceGroup from './choiceGroup';
import { tagGroupTag } from '../../models';

const ResultSymbol = Symbol('Result');

export default class TagGroup extends React.Component {
  getReverseLookup = memoizeOne((tags) => {
    const values2parts = {};
    tags.forEach((x) => {
      values2parts[x.name] = x.tagList;
    });
    return values2parts;
  });

  getTagTree = memoizeOne((tags) => {
    const tree = {};
    tags.forEach((x) => {
      const parts = x.tagList;
      let cur = tree;
      parts.forEach((part) => {
        if (!cur[part]) {
          cur[part] = {};
        }
        cur = cur[part];
      });
      cur[ResultSymbol] = x.name;
    });

    return tree;
  });

  componentDidMount() {
    const { onUpdate, value } = this.props;
    if (!value) {
      onUpdate(this.getOrDefaultChosen().result);
    }
  }

  onChange(idx, val) {
    const { onUpdate, tags, value } = this.props;
    const previousParts = (value && this.getReverseLookup(tags)[value]) || [];
    const { parts, result } = this.getOrDefaultChosen([...previousParts.slice(0, idx), val]);
    onUpdate(result || parts.reduce(
      (node, part) => node[part],
      this.getTagTree(tags),
    )[ResultSymbol]);
  }

  getOrDefaultChosen(rawChosen) {
    const { groupLabels, tags } = this.props;
    const chosen = rawChosen || [];
    if (chosen.length < groupLabels.length) {
      let cur = this.getTagTree(tags);
      const newChosen = cloneDeep(chosen);
      for (let i = 0; i < groupLabels.length; i += 1) {
        if (!newChosen[i]) {
          [newChosen[i]] = Object.keys(cur);
        }
        cur = cur[newChosen[i]];
      }
      return { parts: newChosen, result: cur[ResultSymbol] };
    }
    return { parts: chosen };
  }

  render() {
    const {
      label, value, groupLabels, tags, disabled, baseDockers, isAdd, putAdd, addValue, addSteps, baseDocker
    } = this.props;
    const { parts } = this.getOrDefaultChosen((value && this.getReverseLookup(tags)[value]) || []);
    const content = [];
    let cur = this.getTagTree(tags);
    for (let i = 0; i < groupLabels.length; i += 1) {
      content.push(
        <div className="pb1 f7" key={i}>
          <ChoiceGroup
            addSteps={addSteps}
            isAdd={isAdd}
            addValue={addValue}
            putAdd={putAdd}
            baseDockers={baseDockers}
            baseDocker={baseDocker}
            label={groupLabels[i]}
            options={Object.keys(cur).map( x => ({ name: x}))}
            value={parts[i]}
            onUpdate={val => this.onChange(i, val)}
            disabled={disabled}
          />
        </div>,
      );
      cur = cur[parts[i]];
    }

    return (
      <>
        <div>
          {label}
        </div>
        <div>
          {content}
        </div>
      </>
    );
  }
}

TagGroup.propTypes = {
  label: PropTypes.node.isRequired,
  groupLabels: PropTypes.arrayOf(PropTypes.node).isRequired,
  tags: PropTypes.arrayOf(tagGroupTag).isRequired,
  value: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TagGroup.defaultProps = {
  value: '',
  disabled: false,
};
