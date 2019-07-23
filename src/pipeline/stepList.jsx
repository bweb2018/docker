import { cloneDeep } from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import BaseDockerLIst from '../components/card';
import * as Models from '../models';
import Button from '../components/button';

const mergeRefs = (...refs) => (ref) => {
  refs.forEach((resolvableRef) => {
    if (typeof resolvableRef === 'function') {
      resolvableRef(ref);
    } else {
      // eslint-disable-next-line
			resolvableRef.current = ref;
    }
  });
};

class StepList extends React.Component {
  constructor(props) {
    super(props);
    this.lastCount = props.items.length;
    this.lastItemRef = React.createRef();
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidUpdate() {
    const { items } = this.props;
    if (this.lastCount < items.length && this.lastItemRef.current.scrollIntoView) {
      this.lastItemRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
    this.lastCount = items.length;
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const {
      items,
      onUpdate,
    } = this.props;
    const start = result.source.index;
    const end = result.destination.index;

    const newItems = cloneDeep(items);
    const [removed] = newItems.splice(start, 1);
    newItems.splice(end, 0, removed);
    onUpdate(newItems);
  }

  render() {
    const {
      items, onSelect, selected, onUpdate,
    } = this.props;

    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
      >
        <Droppable droppableId="droppable">
          {provided => (
            <div
              ref={provided.innerRef}
              style={{
                flexGrow: 1,
              }}
            >
              {items.map((item, index) => (
                <Draggable index={index} key={item.id} draggableId={item.id}>
                  {provided2 => (
                    <div
                      ref={index === items.length - 1
                        ? mergeRefs(provided2.innerRef, this.lastItemRef)
                        : provided2.innerRef}
                      {...provided2.draggableProps}
                      {...provided2.dragHandleProps}
                      style={provided2.draggableProps.style}
                    >
                      <BaseDockerLIst
                        name={item.name}
                        icon={item.icon || 'fa fa-terminal'}
                        selected={selected === item.id}
                        warning={item.invalid}
                        onClick={() => onSelect(item)}
                      >
                        <Button
                          className="ml1"
                          onClick={(e) => {
                            e.stopPropagation();

                            const newItems = cloneDeep(items);
                            const idx = newItems.findIndex(ni => ni.id === item.id);
                            newItems.splice(idx, 1);
                            onUpdate(newItems);
                          }}
                        >
                          <i className="fa fa-trash" />
                        </Button>
                      </BaseDockerLIst>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

StepList.propTypes = {
  items: PropTypes.arrayOf(Models.step).isRequired,
  onSelect: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

StepList.defaultProps = {
  onSelect: () => {},
  selected: false,
};

export default StepList;
