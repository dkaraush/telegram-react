import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import './ArrowDown.css';

class ArrowDown extends React.Component {
    constructor(props) {
        super(props);

        this.div = React.createRef();
    }

    setStatus = status => {
        if (this.div.current) {
            let shouldBe = 'arrow-down ' + this.props.class + (status ? '' : ' hidden');
            if (this.div.current.className != shouldBe) this.div.current.className = shouldBe;
        }
    };

    render() {
        return (
            <div ref={this.div} className={'arrow-down ' + this.props.class + ' hidden'} onClick={this.props.onClick}>
                <svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'>
                    <line y2='20' x2='15' y1='12' x1='7' strokeLinecap='round' strokeWidth='3' stroke='#777' />
                    <line y2='20' x2='15' y1='12' x1='23' strokeLinecap='round' strokeWidth='3' stroke='#777' />
                </svg>
            </div>
        );
    }
}

ArrowDown.propTypes = {
    onClick: PropTypes.func
};

export default ArrowDown;
