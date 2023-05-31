import React from "react";

import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import { Formik, FastField, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ReactstrapInput } from "reactstrap-formik";
import UserApi from '../../api/UserApi';
import { useState } from "react";
import { withRouter } from "react-router-dom";

const SignUp = (props) => {

  const [isOpenModal, setOpenModal] = useState(false);

  const [email, setEmail] = useState("");
  const [isDisabledResendEmailButton, setDisabledResendEmailButton] = useState(false);

  const handleCloseModel = () => {
    // open model
    setOpenModal(false);
    // redirect login page
    props.history.push("/auth/sign-in");
  }

  const resendEmailToActiveAccount = async () => {
    setDisabledResendEmailButton(true);
    // call api
    await UserApi.resendEmailToActiveAccount(email);
    setDisabledResendEmailButton(false);
  }

  return (
    <>
      <div className="text-center mt-4">
        <h1 className="h2">Get started</h1>
        <p className="lead">
          Create account to experience the course at <b>VTI Academy</b>.
        </p>
      </div>

      <Formik
        initialValues={
          {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
            confirmpassword: '',
            errorForm: ''
          }
        }
        validationSchema={
          Yup.object({
            firstname: Yup.string()
              .max(50, 'Must be less than 50 characters or equal')
              .required('Required'),

            lastname: Yup.string()
              .max(50, 'Must be less than 50 characters or equal')
              .required('Required'),

            username: Yup.string()
              .required('Required')
              .max(50, 'Must be between 6 to 50 characters')
              .min(6, 'Must be between 6 to 50 characters')
              .test('checkUniqueUsername', 'This username is already registered.', async username => {
                // call api
                const isExists = await UserApi.existsByUsername(username);
                return !isExists;
              }),

            email: Yup.string()
              .required('Required')
              .max(50, 'Must be between 6 to 50 characters')
              .min(6, 'Must be between 6 to 50 characters')
              .email('Invalid email address')
              .test('checkUniqueEmail', 'This email is already registered.', async email => {
                // call api
                const isExists = await UserApi.existsByEmail(email);
                return !isExists;
              }),

            password: Yup.string()
              .max(50, 'Must be between 6 to 50 characters')
              .min(6, 'Must be between 6 to 50 characters')
              .required('Required'),

            confirmpassword: Yup.string()
              .when("password", {
                is: value => (value && value.length > 0 ? true : false),
                then: Yup.string().oneOf(
                  [Yup.ref("password")],
                  "Both password need to be the same"
                )
              })
              .required('Required')
          })
        }
        onSubmit={
          async (values, { setFieldError }) => {
            try {
              // call api
              await UserApi.create(
                values.username,
                values.email,
                values.password,
                values.firstname,
                values.lastname);
              // open model 
              setOpenModal(true);
              setEmail(values.email);
            } catch (error) {
              setFieldError('errorForm', 'There is an error from the server');
              console.log(error);
            }
          }
        }
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ isSubmitting }) => (
          <Card>
            <CardBody>
              <div className="m-sm-4">
                <Form>
                  {/* Firstname */}
                  <FormGroup>
                    <FastField
                      label="First Name"
                      bsSize="lg"
                      type="text"
                      name="firstname"
                      placeholder="Enter your first name"
                      component={ReactstrapInput}
                    />
                  </FormGroup>

                  {/* Lastname */}
                  <FormGroup>
                    <FastField
                      label="Last Name"
                      bsSize="lg"
                      type="text"
                      name="lastname"
                      placeholder="Enter your last name"
                      component={ReactstrapInput}
                    />
                  </FormGroup>

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

                  {/* email */}
                  <FormGroup>
                    <FastField
                      label="Email"
                      bsSize="lg"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
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
                  </FormGroup>

                  {/* confirm password */}
                  <FormGroup>
                    <FastField
                      label="Confirm Password"
                      bsSize="lg"
                      type="password"
                      name="confirmpassword"
                      placeholder="Enter confirm password"
                      component={ReactstrapInput}
                    />
                  </FormGroup>

                  <ErrorMessage name="errorForm" component={"div"} className="invalid-feedback" style={{ display: "block" }} />

                  {/* submit */}
                  <div className="text-center mt-3">
                    <Button type="submit" color="primary" size="lg" disabled={isSubmitting}>
                      Sign up
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
            We have sent an email to <b>{email}</b>.
          </p>
          <p>
            Please check your email to active account.
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

          {/* login */}
          <Button
            color="primary"
            onClick={handleCloseModel}
            type="submit"
          >
            Login
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )

};

export default withRouter(SignUp);
