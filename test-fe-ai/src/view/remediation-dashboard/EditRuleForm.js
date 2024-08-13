import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import useFetch_GET from "../../services/http/Get";
import useFetch_POST from "../../services/http/Post";

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
  }, [getData, remediationId]);

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
    <div className="flex justify-center items-center h-[calc(100vh-100px)] p-4">
      <div className="bg-white shadow-lg w-full max-w-lg p-6 mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Recommendation</h1>
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
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row items-start">
                  <label className="text-gray-700 font-medium mb-2 md:mb-0 md:w-1/4" htmlFor="problemTitle">
                    Problem Title:
                  </label>
                  <div className="md:w-3/4">
                    <Field
                      id="problemTitle"
                      name="problemTitle"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="problemTitle"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start">
                  <label className="text-gray-700 font-medium mb-2 md:mb-0 md:w-1/4" htmlFor="subProblemTitle">
                    Sub-Problem:
                  </label>
                  <div className="md:w-3/4">
                    <Field
                      id="subProblemTitle"
                      name="subProblemTitle"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="subProblemTitle"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start">
                  <label className="text-gray-700 font-medium mb-2 md:mb-0 md:w-1/4" htmlFor="serviceName">
                    Service Name:
                  </label>
                  <div className="md:w-3/4">
                    <Field
                      id="serviceName"
                      name="serviceName"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="serviceName"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start">
                  <label className="text-gray-700 font-medium mb-2 md:mb-0 md:w-1/4" htmlFor="resolutionScript">
                    Resolution Script:
                  </label>
                  <div className="md:w-3/4">
                    <Field
                      id="resolutionScript"
                      name="resolutionScript"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="resolutionScript"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start">
                  <label className="text-gray-700 font-medium mb-2 md:mb-0 md:w-1/4" htmlFor="recommendation">
                    Recommendation:
                  </label>
                  <div className="md:w-3/4">
                    <Field
                      id="recommendation"
                      name="recommendation"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="recommendation"
                      component="div"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-200 outline-none shadow hover:bg-slate-300 focus:outline-none disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Update
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditRuleForm;
