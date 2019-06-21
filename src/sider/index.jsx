import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Menu, Icon, Switch } from 'antd';
import 'antd/dist/antd.css';
const { SubMenu }  = Menu;

import Pipeline from '../pipeline/pipeline';
import * as Models from "../models";
import BaseDockerLIst from "../components/card";
class Index extends React.Component {

    handleClick = e => {
        console.log('click ', e);
    };

    render() {
        const {content, config, onSwitchContent} = this.props;
        return (
            <div>
                <Menu
                    onClick={this.handleClick}
                    style={{ width: 256 }}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                >
                    <Menu.Item key="1" className="ant-menu-item-selected"
                       onClick={() => { onSwitchContent({ type: 'edit_general' }); }}
                    >General
                        <Icon type="warning" />
                        <BaseDockerLIst
                            name={config.general.name}
                            pointer
                            warning={config.general.invalid}
                            selected={content.type === 'edit_general'}
                            onClick={() => { onSwitchContent({ type: 'edit_general' }); }}
                        />
                    </Menu.Item>
                    <Menu.Item key="2"
                       onClick={() => { onSwitchContent({ type: 'edit_docker' }); }}>From
                        <Icon type="warning" />
                    </Menu.Item>
                    <Menu.Item key="3">Run
                        <Icon type="warning" />
                    </Menu.Item>
                    <Menu.Item key="4">Entrypoint
                        <Icon type="warning" />
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}

Index.propTypes = {
    config: Models.config.isRequired,
    content: Models.content.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onSwitchContent: PropTypes.func.isRequired,
};
export default Index;
