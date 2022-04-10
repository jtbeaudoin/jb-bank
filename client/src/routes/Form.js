import React, { useState } from "react";
import Header from "../components/Header";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Typography } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import Textfield from "../components/Textfield";
import Button from "../components/Button";

const useStyles = makeStyles((theme) => ({
  formWrapper: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8),
  },
}));

const INITIAL_FORM_STATE = {
  name_first: "",
  name_last: "",
  email_address: "",
  phone_number: "",
  address_line_1: "",
  address_line_2: "",
  address_city: "",
  address_state: "",
  address_postal_code: "",
  birth_date: "",
  document_ssn: "",
};

const FORM_VALIDATION = Yup.object().shape({
  name_first: Yup.string().required("First name is required"),
  name_last: Yup.string().required("Last name is required"),
  email_address: Yup.string()
    .required("Email is required")
    .email("Invalid email"),
  phone_number: Yup.number()
    .required("Phone number is required")
    .integer()
    .typeError("Please enter a valid phone number"),
  address_line_1: Yup.string().required("Address is required"),
  address_line_2: Yup.string(),
  address_city: Yup.string().required("City is required"),
  address_state: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Enter valid State")
    .min(2, "Enter valid state")
    .max(2, "Enter valid state")
    .required("State is required"),
  address_postal_code: Yup.string()
    .matches(/^[0-9]+$/, "Enter valid zip")
    .min(5, "Enter valid zip")
    .max(5, "Enter valid zip")
    .required("Zip is required"),
  birth_date: Yup.string().required("Birth date is required"),
  document_ssn: Yup.string()
    .matches(/^[0-9]+$/, "Enter valid SSN")
    .min(9, "Enter valid SSN")
    .max(9, "Enter valid SSN")
    .required("SSN is required"),
});

const FormikForm = () => {
  const classes = useStyles();
  const [result, setResult] = useState(null);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Header />
        {result === "Approved" && (
          <Alert severity="success">
            <AlertTitle>Success!</AlertTitle>
            You've Been Approved!
          </Alert>
        )}

        {result === "Manual Review" && (
          <Alert severity="success">
            <AlertTitle>Thank you for submitting your application</AlertTitle>
            We'll be in touch with you shortly.
          </Alert>
        )}

        {result === "Denied" && (
          <Alert severity="error">
            <AlertTitle>Denied</AlertTitle>
            Sorry your application was not successful
          </Alert>
        )}

      </Grid>
      <Grid item xs={12}>
        <Container maxWidth="md">
          <div className={classes.formWrapper}>
            <Formik
              initialValues={{
                ...INITIAL_FORM_STATE,
              }}
              validationSchema={FORM_VALIDATION}
              onSubmit={(values) => {

                fetch("/api/clientOnboard", {
                  method: "POST",
                  body: JSON.stringify(values),
                  headers: new Headers({
                    "Content-Type": "application/json; charset=UTF-8",
                  }),
                })
                  .then((res) => {
                    return res.json();
                  })
                  .then((data) => {
                    {
                      setResult(data.result);
                    }
                  });
              }}
            >
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>Your details</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Textfield name="name_first" label="First Name" />
                  </Grid>

                  <Grid item xs={6}>
                    <Textfield name="name_last" label="Last Name" />
                  </Grid>

                  <Grid item xs={12}>
                    <Textfield name="email_address" label="Email" />
                  </Grid>

                  <Grid item xs={12}>
                    <Textfield name="phone_number" label="Phone" />
                  </Grid>

                  <Grid item xs={6}>
                    <Textfield
                      name="birth_date"
                      label="Birth Date (YYYY-MM-DD)"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Textfield name="document_ssn" label="SSN" />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography>Address</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Textfield name="address_line_1" label="Address Line 1" />
                  </Grid>

                  <Grid item xs={12}>
                    <Textfield name="address_line_2" label="Address Line 2" />
                  </Grid>

                  <Grid item xs={4}>
                    <Textfield name="address_city" label="City" />
                  </Grid>

                  <Grid item xs={4}>
                    <Textfield name="address_state" label="State" />
                  </Grid>

                  <Grid item xs={4}>
                    <Textfield name="address_postal_code" label="Zip Code" />
                  </Grid>

                  <Grid item xs={12}>
                    <Button>Submit</Button>
                  </Grid>
                </Grid>
              </Form>
            </Formik>
          </div>
        </Container>
      </Grid>
    </Grid>
  );
};

export default FormikForm;
