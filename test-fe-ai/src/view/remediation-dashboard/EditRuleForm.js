import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import useFetch_GET from "../../services/http/Get";
import useFetch_POST from "../../services/http/Post";
import "./RemidiationForm.css";

const EditRuleForm = () => {
  const { isLoading, error, data, postData } = useFetch_POST();
  const {
    isLoading: getLoading,
    error: getError,
    data: dataObj,
    getData,
  } = useFetch_GET();
  const problem = useSelector((state) => state.problem);
  const formikRef = useRef(null);
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    resolutionScript: Yup.string().required("This field is required"),
    recommendation: Yup.string().required("This field is required"),
    serviceName: Yup.string().required("This field is required"),
    subProblemTitle: Yup.string().required("This field is required"),
    problemTitle: Yup.string().required("This field is required"),
  });

  const { remediationId, problemId } = useParams();

  useEffect(() => {
    getData(`/get_remediation/${remediationId}`);
  }, []);

  useEffect(() => {
    if (dataObj && formikRef.current) {
      formikRef.current.setValues({
        problemTitle: dataObj.problemTitle || "",
        subProblemTitle: dataObj.subProblemTitle || "",
        resolutionScript: dataObj.scriptPath || "",
        recommendation: dataObj.recommendationText || "",
        serviceName: dataObj.serviceName || "",
      });
    }
  }, [dataObj]);

  const handleSubmit = async (values) => {
    values["problemId"] = problem?.problemId;
    values["status"] = "resolved";
    postData(`/edit_remediation/${problemId}/${remediationId}`, values);
  };
  if (data?.status === 200) navigate("/recommendation");
  return (
    <div className="middle-panel">
      <div className="table-header">Edit Recommendation</div>
      <Formik
        initialValues={{
          problemTitle: "",
          subProblemTitle: "",
          resolutionScript: "",
          recommendation: "",
          serviceName: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formikRef}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="middle-panel-text">
              <div className="form-value">
                <div style={{ width: "20%", marginTop: "10px" }}>
                  <p className="recommendation-title">
                    <strong>Problem Title: </strong>
                  </p>
                </div>
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "10px",
                  }}
                >
                  <Field
                    className="new-rule-input-box"
                    name="problemTitle"
                    type="text"
                    title="Problem title"
                  />
                  <ErrorMessage
                    name="problemTitle"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div className="form-value">
                <div style={{ width: "20%", marginTop: "10px" }}>
                  <p className="recommendation-title">
                    <strong>Sub-Problem: </strong>
                  </p>
                </div>
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "10px",
                  }}
                >
                  <Field
                    className="new-rule-input-box"
                    name="subProblemTitle"
                    type="text"
                    title="Sub-Problem"
                  />
                  <ErrorMessage
                    name="subProblemTitle"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div className="form-value">
                <div style={{ width: "20%", marginTop: "10px" }}>
                  <p className="recommendation-title">
                    <strong>Service Name: </strong>
                  </p>
                </div>
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "10px",
                  }}
                >
                  <Field
                    className="new-rule-input-box"
                    name="serviceName"
                    type="text"
                    title="Service-Name"
                  />
                  <ErrorMessage
                    name="serviceName"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div className="form-value">
                <div style={{ width: "20%", marginTop: "10px" }}>
                  <p className="recommendation-title">
                    <strong>Resolution Script: </strong>
                  </p>
                </div>
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "10px",
                  }}
                >
                  <Field
                    className="new-rule-input-box"
                    name="resolutionScript"
                    type="text"
                    title="Resolution script"
                  />
                  <ErrorMessage
                    name="resolutionScript"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div className="form-value">
                <div style={{ width: "20%", marginTop: "10px" }}>
                  <p className="recommendation-title">
                    <strong>Recommendation: </strong>
                  </p>
                </div>
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    justifyContent: "start",
                    marginTop: "10px",
                  }}
                >
                  <Field
                    className="new-rule-input-box"
                    name="recommendation"
                    type="text"
                    title="Recommendation"
                  />
                  <ErrorMessage
                    name="recommendation"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="button" disabled={isSubmitting}>
              Update
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditRuleForm;
