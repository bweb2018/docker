import FileSaver from 'file-saver';
import * as PropTypes from 'prop-types';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

import Button from '../components/button';

class EditDockerfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      content: props.text,
      switchColor: ''
    };
    this.textArea = React.createRef();
  }

  onChange = (e) => {
    this.setState({ content: e.target.value });
  }

  onEdit = () => {
    this.setState({ editing: true });
  }

  onCopy = () => {
    const { switchColor } = this.state
    this.setState({
      switchColor: !switchColor
    })
    this.textArea.current.select();
    console.log(this)
    document.execCommand('copy');
  }

  onSave = () => {
    const { content } = this.state;
    FileSaver.saveAs(new Blob([content]), 'Dockerfile');
  }

  render() {
    const { content, editing, switchColor } = this.state;
    return (
      <div className="bg-white pa3 f6 mh3 bt b--near-white">
        <div>Content</div>
        <textarea
          ref={this.textArea}
          className= "mt2 w-100 bg-black white"
          style={{ height: '96rem', maxHeight: '50vh' }}
          value={content}
          disabled={!editing}
          onChange={this.onChange}
          spellCheck={false}
        />
        <div className="mt2">
          <div>
            <Button className="mr2 pa1 ph3 bg-black-05" onClick={this.onCopy}>
              <span className='black'>Copy</span>
            </Button>
            {/*{!editing && (*/}
              <Button className="mr2 pa1 ph3 bg-black-05" onClick={this.onEdit}>
                 <span className='black'>Edit</span>
              </Button>
            {/*)}*/}
            <Button className="mr2 pa1 ph3 bg-black-05" onClick={this.onSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

EditDockerfile.propTypes = {
  text: PropTypes.string.isRequired,
};

export default EditDockerfile;
