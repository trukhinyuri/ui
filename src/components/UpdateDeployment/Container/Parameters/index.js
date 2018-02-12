import React, { Component } from 'react';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';

class Parameters extends Component {
	componentDidMount() {
		if (this.props.item.resources.requests.cpu) {
			const cpu = document.getElementById(`cpu-name-form-group__label${this.props.item.id}`);
			cpu ? cpu.classList.add('form-group__label-always-onfocus') : null;
		}
		if (this.props.item.resources.requests.memory) {
			const memory = document.getElementById(`ram-name-form-group__label${this.props.item.id}`);
			memory ? memory.classList.add('form-group__label-always-onfocus') : null;
		}
	}
    render() {
        return (
	        <div
		        className="row rowLine"
		        id={`container${this.props.index}-parameters`}
	        >
		        <div className="col-md-12">
			        <div className="containerTitle containerBlockTitle"><span>*</span> Parameters
				        {/*<Tooltip*/}
					        {/*placement='top'*/}
					        {/*trigger={['hover']}*/}
					        {/*overlay={<span>Text of notificatiorem ipsum alist delor set. Text of <br/>notification. Lore ipsum delor upset ore ipsum delor <br/>upset</span>}*/}
				        {/*>*/}
					        {/*<span className="myTooltip" data-toggle="tooltip">?</span>*/}
				        {/*</Tooltip>*/}
			        </div>
		        </div>
		        <div className="col-md-5 myColumn">
			        <div className="form-group">
				        <input
					        className="form-group__input-text form-control customInput"
					        id={`cpu${this.props.index}`}
					        type="text"
					        pattern="^\d+(.\d+)?m?$"
					        required title="error"
					        value={this.props.item.resources.requests.cpu}
					        onChange={(e) => {
						        this.props.onChangeInputParameters({
							        cpu: e.target.value,
							        index: this.props.index - 1
						        });
						        if (e.target.value.length === 0) {
							        document.getElementById(`cpu-name-form-group__label${this.props.item.id}`).classList.remove('form-group__label-always-onfocus');
						        } else {
							        document.getElementById(`cpu-name-form-group__label${this.props.item.id}`).classList.add('form-group__label-always-onfocus');
						        }
					        }}
				        />
				        <label
					        className="form-group__label"
					        id={`cpu-name-form-group__label${this.props.item.id}`}
					        htmlFor={`cpu${this.props.index}`}
				        >CPU</label>
				        <div className="form-group__helper helperText">Example: 0,3 or 300m</div>
			        </div>
		        </div>

		        <div className="col-md-5 myColumn">
			        <div className="form-group">
				        <input
					        className="form-group__input-text form-control customInput"
					        id={`ram${this.props.index}`}
					        type="text"
					        pattern="^\d+(.\d+)?(Mi|Gi)$"
					        required title="error"
					        value={this.props.item.resources.requests.memory}
					        onChange={(e) => {
						        this.props.onChangeInputParameters({
							        memory: e.target.value,
							        index: this.props.index - 1
						        });
						        if (e.target.value.length === 0) {
							        document.getElementById(`ram-name-form-group__label${this.props.item.id}`).classList.remove('form-group__label-always-onfocus');
						        } else {
							        document.getElementById(`ram-name-form-group__label${this.props.item.id}`).classList.add('form-group__label-always-onfocus');
						        }
					        }}
				        />
				        <label
					        className="form-group__label"
					        htmlFor={`ram${this.props.index}`}
					        id={`ram-name-form-group__label${this.props.item.id}`}
				        >RAM</label>
				        <div className="form-group__helper helperText">Example 0,5Gi or 512Mi</div>
			        </div>
		        </div>
	        </div>
        );
    }
}

Parameters.propTypes = {
	index: PropTypes.number.isRequired,
	item: PropTypes.object.isRequired,
	onChangeInputParameters: PropTypes.func.isRequired
};

export default Parameters;
