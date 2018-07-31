import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { injectNOS, nosProps } from "@nosplatform/api-functions/lib/react";

const styles = {
  button: {
    margin: "16px",
    fontSize: "14px"
  }
};

class NOSActions extends React.Component {
  constructor() {
    super();

    this.state = {
      loaded: -1,
      gas_balance: null,
    };
  }

  GAS_PER_DAY_PER_GAS = 0.0003;
  GAS_PER_WEEK_PER_GAS = 0.0018;
  GAS_PER_MONTH_PER_GAS = 0.0080;
  GAS_PER_YEAR_PER_GAS = 0.0945;

  GAS_CONTRACT = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";

  handleAlert = async func => alert(await func);

  loadGasBalance = async () => {
    const { nos } = this.props;

    const cloneState = Object.assign({}, this.state);
    cloneState.loaded = 0;
    this.setState(cloneState);

    const gasBalance = await nos.getBalance({ asset: this.GAS_CONTRACT });

    this.setState({
      gas_balance: gasBalance,
      loaded: 1
    });
  };

  render() {
    const { classes } = this.props;

    let nestedElement;
    if (this.state.loaded === -1) {
      nestedElement = <div />;
    } else if (this.state.loaded === 0) {
      nestedElement = <div>Loading...</div>;
    } else {
      const gasBalance = this.state.gas_balance;
      nestedElement = (
        <div>
          <div>{`${gasBalance} GAS`}</div>
          <h1>Rewards</h1>
          <div>{`Per day: ${parseFloat(gasBalance) * this.GAS_PER_DAY_PER_GAS} GAS`}</div>
          <div>{`Per week: ${parseFloat(gasBalance) * this.GAS_PER_WEEK_PER_GAS} GAS`}</div>
          <div>{`Per month: ${parseFloat(gasBalance) * this.GAS_PER_MONTH_PER_GAS} GAS`}</div>
          <div>{`Per year: ${parseFloat(gasBalance) * this.GAS_PER_YEAR_PER_GAS} GAS`}</div>
        </div>
      );
    }

    return (
      <React.Fragment>
        <button className={classes.button} onClick={() => this.loadGasBalance()}>
          Load GAS balance and calculate reward
        </button>
        {nestedElement}
      </React.Fragment>
    );
  }
}

NOSActions.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  nos: nosProps.isRequired
};

export default injectNOS(injectSheet(styles)(NOSActions));
