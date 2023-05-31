import React from "react";

import {
  Button,
  Card,
  CardBody,
  FormGroup
} from "reactstrap";
import { Formik, FastField, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ReactstrapInput } from "reactstrap-formik";
import UserApi from '../../api/UserApi';
import { useParams } from "react-router-dom";
import { toastr } from "react-redux-toastr";

const NewPassword = (props) => {

  const { token } = useParams();

  const showSucessNotification = (title, message) => {
    const options = {
      timeOut: 2500,
      showCloseButton: false,
      progressBar: false,
      position: "top-right"
    };

    // show notification
    toastr.success(title, message, options);
  }

  return (
    <React.Fragment>
      <div className="text-center mt-4">
        <h1 className="h2">Reset password</h1>
        <p className="lead">Enter your new password.</p>
      </div>

      <Formik
        initialValues={
          {
            password: '',
            confirmpassword: '',
            errorForm: ''
          }
        }
        validationSchema={
          Yup.object({
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
              await UserApi.resetPassword(token, values.password);

              // notification
              showSucessNotification(
                "Reset Password",
                "Reset Password Successfully!"
              );

              // redirect login page
              props.history.push("/auth/sign-in");

            } catch (error) {
              setFieldError('errorForm', 'There is an error from the server');
              console.log(error);
            }
          }
        }
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <Card>
            <CardBody>
              <div className="m-sm-4">
                <Form>

                  {/* password */}
                  <FormGroup>
                    <FastField
                      label="Password"
                      bsSize="lg"
                      type="password"
                      name="password"
                      placeholder="Enter new password"
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
                      placeholder="Enter confirm new password"
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
    </React.Fragment>
  )
};

export default NewPassword;
