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

const ResetPassword = (props) => {

  const [isOpenModal, setOpenModal] = useState(false);

  const [email, setEmail] = useState("");
  const [isDisabledResendEmailButton, setDisabledResendEmailButton] = useState(false);

  const handleCloseModel = () => {
    // open model
    setOpenModal(false);
    // redirect login page
    props.history.push("/auth/sign-in");
  }

  const resendEmailToResetPassword = async () => {
    setDisabledResendEmailButton(true);
    // call api
    await UserApi.resendEmailToResetPassword(email);
    setDisabledResendEmailButton(false);
  }

  return (
    <React.Fragment>
      <div className="text-center mt-4">
        <h1 className="h2">Reset password</h1>
        <p className="lead">Enter your email to reset your password.</p>
      </div>

      <Formik
        initialValues={
          {
            email: '',
            errorForm: ''
          }
        }
        validationSchema={
          Yup.object({
            email: Yup.string()
              .required('Required')
              .max(50, 'Must be between 6 to 50 characters')
              .min(6, 'Must be between 6 to 50 characters')
              .email('Invalid email address')
              .test('checkEmailExists', 'This email is not exists.', async email => {
                // call api
                const isExists = await UserApi.existsByEmail(email);
                return isExists;
              })
          })
        }
        onSubmit={
          async (values, { setFieldError }) => {
            try {
              // call api
              await UserApi.requestResetPassword(values.email);

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

                  <ErrorMessage name="errorForm" component={"div"} className="invalid-feedback" style={{ display: "block" }} />

                  <div className="text-center mt-3">
                    <Button type="submit" color="primary" size="lg" disabled={isSubmitting}>
                      Reset password
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
          You need to confirm reset password
        </ModalHeader>

        {/* body */}
        <ModalBody className="m-3">
          <p>
            We have sent an email to <b>{email}</b>.
          </p>
          <p>
            Please check your email to reset password.
          </p>
        </ModalBody>

        {/* footer */}
        <ModalFooter>
          {/* resend */}
          <Button
            color="primary"
            onClick={resendEmailToResetPassword}
            style={{ marginLeft: 10 }}
            disabled={isDisabledResendEmailButton}
          >
            Resend
          </Button>

          {/* login */}
          <Button
            type="submit"
            color="primary"
            onClick={handleCloseModel}
          >
            Login
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
};

export default ResetPassword;
