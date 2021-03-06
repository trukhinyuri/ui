/* @flow */

import React, { PureComponent } from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Helmet from 'react-helmet';
import cookie from 'react-cookies';
import isEmail from 'validator/lib/isEmail';
import Recaptcha from 'react-google-recaptcha';

import { appRecaptcha, routerLinks } from '../../config';
import * as signUpLogin from '../../actions/signUp';
import InputEmail from '../../components/InputEmail';
import InputPassword from '../../components/InputPassword';
import LoadButton from '../../components/LoadButton';
import globalStyles from '../../theme/global.scss';
import buttonStyles from '../../theme/buttons.scss';
import styles from './index.scss';
import logoContainerum from '../../images/logo_containerum_lv.svg';

type Props = {
  signUpReducer: Object,
  fetchSignUpIfNeeded: (
    email: string,
    password: string,
    recaptcha: string
  ) => void
};

class SignUp extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isValidEmail: true,
      password: '',
      isValidPassword: true,
      recaptcha: '',
      errorMessage: 'Email or Password is not valid'
    };
  }
  componentDidMount() {
    cookie.remove('accessToken', { path: '/' });
    cookie.remove('refreshToken', { path: '/' });
  }
  componentWillUpdate(nextProps) {
    if (
      nextProps.signUpReducer.err &&
      this.props.signUpReducer.err !== nextProps.signUpReducer.err
    ) {
      this.setState({
        ...this.state,
        isValidEmail: false,
        isValidPassword: false,
        errorMessage: nextProps.signUpReducer.err
      });
    }
  }
  handleChangeEmail(email) {
    this.setState({
      ...this.state,
      email
    });
  }
  handleChangePassword(password) {
    this.setState({
      ...this.state,
      password
    });
  }
  handleVerifyRecaptchaCallback(recaptchaKey) {
    this.setState({
      ...this.state,
      recaptcha: recaptchaKey
    });
  }
  handleSubmitSignUpAction(e) {
    e.preventDefault();
    if (
      isEmail(this.state.email) &&
      // this.state.recaptcha &&
      this.state.password.length > 7
    ) {
      const { email, password, recaptcha } = this.state;
      this.props.fetchSignUpIfNeeded(email, password, recaptcha);
    } else {
      this.setState({
        ...this.state,
        isValidEmail: false,
        isValidPassword: false,
        errorMessage: 'Email or Password is not valid'
      });
    }
  }
  render() {
    const {
      email,
      isValidEmail,
      password,
      isValidPassword,
      // recaptcha,
      errorMessage
    } = this.state;
    return (
      <div>
        <Helmet title="Sign Up" />
        <div className={`${globalStyles.window} ${styles.windowSignUp}`}>
          <div className={globalStyles.windowForm}>
            <div className={globalStyles.mainForm}>
              <div
                className={`${globalStyles.formHeader} ${
                  globalStyles.formHeaderLogin
                }`}
              >
                Sign Up
              </div>
              {(!isValidEmail || !isValidPassword) && (
                <div className={globalStyles.errorMessage}>
                  <span className={globalStyles.errorMessageText}>
                    {errorMessage}
                  </span>
                </div>
              )}
              <form onSubmit={e => this.handleSubmitSignUpAction(e)}>
                <InputEmail
                  handleChangeEmail={value => this.handleChangeEmail(value)}
                  value={email}
                  id="email"
                  placeholder="Email"
                />
                <InputPassword
                  handleChangePassword={value =>
                    this.handleChangePassword(value)
                  }
                  value={password}
                  id="password"
                  placeholder="Password"
                />
                {appRecaptcha !== '{{ RECAPTCHA }}' && (
                  <Recaptcha
                    style={{
                      margin: '28px 0 25px',
                      transform: 'scale(1.175)',
                      width: 0
                    }}
                    sitekey={appRecaptcha}
                    onChange={recaptchaKey =>
                      this.handleVerifyRecaptchaCallback(recaptchaKey)
                    }
                  />
                )}
                <LoadButton
                  type="submit"
                  buttonText="Create account"
                  typeMiniSpinner="transparency"
                  isFetching={this.props.signUpReducer.isFetching}
                  baseClassButton={`${buttonStyles.buttonUI} ${
                    buttonStyles.buttonUIPrimary
                  } ${globalStyles.authBtnMargin}`}
                />
              </form>
              <div className={globalStyles.windowLinksBlock}>
                <div className={globalStyles.windowLinksBlockText}>
                  Already have an Account? <br />
                  <NavLink activeClassName="active" to={routerLinks.login}>
                    Log In here
                  </NavLink>
                </div>
              </div>

              {false && (
                <div>
                  <span className={globalStyles.orDivider}>or</span>
                  <div className={globalStyles.socialTitle}>
                    Sign up with your favourite social profile
                  </div>
                  <div className={globalStyles.socialWrapper}>
                    <a href="https://github.com/">
                      <img
                        src={require('../../images/github.svg')}
                        alt="github"
                      />
                    </a>
                    <a
                      href="https://google.com/"
                      className={globalStyles.socialCenterIcon}
                    >
                      <img
                        src={require('../../images/google.svg')}
                        alt="google"
                      />
                    </a>
                    <a href="https://facebook.com/">
                      <img src={require('../../images/fb.svg')} alt="fb" />
                    </a>
                  </div>
                </div>
              )}
            </div>
            <img
              src={logoContainerum}
              alt="logo containerum"
              style={{
                bottom: 30,
                position: 'absolute',
                right: 170
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

const connector: Connector<{}, Props> = connect(
  ({ signUpReducer }) => ({
    signUpReducer
  }),
  dispatch => ({
    fetchSignUpIfNeeded: (email: string, password: string, recaptcha: string) =>
      dispatch(signUpLogin.fetchSignUpIfNeeded(email, password, recaptcha))
  })
);

export default connector(SignUp);
