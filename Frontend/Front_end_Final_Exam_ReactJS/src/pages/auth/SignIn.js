import React from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  CustomInput,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import { Formik, FastField, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ReactstrapInput } from "reactstrap-formik";
import LoginApi from '../../api/LoginApi';
import UserApi from '../../api/UserApi';
import Storage from "../../Storage/Storage";
import { toastr } from "react-redux-toastr";
import { useState } from "react";
import { connect } from 'react-redux';
import { setTokenInfo, setUserLoginInfo, setRememberMeInfo } from "../../redux/actions/userLoginInfoActions";
import avatar from "../../assets/img/avatars/avatar.jpg";
import { selectRememberMe } from "../../redux/selectors/userLoginInfoSelector";

const SignIn = (props) => {

  const showWrongLoginNotification = (title, message) => {
    const options = {
      timeOut: 2500,
      showCloseButton: false,
      progressBar: false,
      position: "top-right"
    };

    // show notification
    toastr.error(title, message, options);
  }

  const [isOpenModal, setOpenModal] = useState(false);

  const [email, setEmail] = useState("");
  const [isDisabledResendEmailButton, setDisabledResendEmailButton] = useState(false);

  const resendEmailToActiveAccount = async () => {
    setDisabledResendEmailButton(true);
    // call api
    await UserApi.resendEmailToActiveAccount(email);
    setDisabledResendEmailButton(false);
  }

  const [isRememberMe, setRememberMe] = useState(props.isRememberMe);

  return (
    <React.Fragment>
      <div className="text-center mt-4">
        <h2>Welcome to VTI Academy</h2>
        <p className="lead">Sign in to your account to continue</p>
      </div>

      <Formik
        initialValues={
          {
            username: '',
            password: '',
            errorForm: ''
          }
        }
        validationSchema={
          Yup.object({
            username: Yup.string()
              .required('Required')
              .max(50, 'Must be between 6 to 50 characters')
              .min(6, 'Must be between 6 to 50 characters'),

            password: Yup.string()
              .max(50, 'Must be between 6 to 50 characters')
              .min(6, 'Must be between 6 to 50 characters')
              .required('Required')
          })
        }
        onSubmit={
          async (values, { setFieldError }) => {
            try {
              // call api
              const result = await LoginApi.login(values.username, values.password);

              // login successfully!
              // account not active
              if (result.status === "NOT_ACTIVE") {
                // open model 
                setOpenModal(true);
                setEmail(result.email);

              } else {
                // account actived
                // save remember me to storage
                Storage.setRememberMe(isRememberMe);
                // save token to storage
                Storage.setToken(result.token);
                // save user info to storage
                const user = {
                  "firstname": result.firstName,
                  "lastname": result.lastName,
                  "username": result.userName,
                  "email": result.email,
                  "role": result.role,
                  "status": result.status
                };
                Storage.setUserInfo(user);

                // save remember me to redux
                props.setRememberMeInfo(isRememberMe)
                // save token to redux
                props.setTokenInfo(result.token);
                // save user info to redux
                props.setUserLoginInfo(user);

                // redirect home page
                props.history.push("/dashboard/default");
              }
            } catch (error) {
              if (error.status === 401) {
                showWrongLoginNotification("Login Failed", "Wrong username or password!");
              } else {
                setFieldError('errorForm', 'There is an error from the server');
                console.log(error);
              }
            }
          }
        }
      >
        {({ isSubmitting }) => (
          <Card>
            <CardBody>
              <div className="m-sm-4">
                <div className="text-center">
                  <img
                    src={avatar}
                    alt="Chris Wood"
                    className="img-fluid rounded-circle"
                    width="132"
                    height="132"
                  />
                </div>
                <Form>

                  {/* username */}
                  <FormGroup>
                    <FastField
                      label="Username"
                      bsSize="lg"
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      component={ReactstrapInput}
                    />
                  </FormGroup>

                  {/* password */}
                  <FormGroup>
                    <FastField
                      label="Password"
                      bsSize="lg"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      component={ReactstrapInput}
                    />
                    {/* forgot password */}
                    <small>
                      <Link to="/auth/reset-password">Forgot password?</Link>
                    </small>
                  </FormGroup>

                  <ErrorMessage name="errorForm" component={"div"} className="invalid-feedback" style={{ display: "block" }} />

                  {/* remember me */}
                  <div>
                    <CustomInput
                      type="checkbox"
                      id="rememberMe"
                      label="Remember me next time"
                      checked={isRememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                  </div>

                  {/* submit */}
                  <div className="text-center mt-3">
                    <Button type="submit" color="primary" size="lg" disabled={isSubmitting}>
                      Sign in
                  </Button>
                  </div>
                </Form>
              </div>
            </CardBody>
          </Card>
        )}
      </Formik>

      <Modal
        isOpen={isOpenModal}
      >
        {/* header */}
        <ModalHeader>
          You need to confirm your account
        </ModalHeader>

        {/* body */}
        <ModalBody className="m-3">
          <p>
            Your account is not active.
          </p>
          <p>
            Please check your email (<b>{email}</b>) to active account.
          </p>
        </ModalBody>

        {/* footer */}
        <ModalFooter>
          {/* resend */}
          <Button
            color="primary"
            onClick={resendEmailToActiveAccount}
            style={{ marginLeft: 10 }}
            disabled={isDisabledResendEmailButton}
          >
            Resend
          </Button>

          {/* close button */}
          <Button
            color="primary"
            onClick={() => setOpenModal(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
};

const mapGlobalStateToProps = state => {
  return {
    isRememberMe: selectRememberMe(state)
  };
};

export default connect(mapGlobalStateToProps, { setTokenInfo, setUserLoginInfo, setRememberMeInfo })(SignIn);
