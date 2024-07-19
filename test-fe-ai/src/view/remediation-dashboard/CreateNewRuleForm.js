import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useFetch_POST from "../../services/http/Post";

const CreateNewRuleForm = () => {
  const { isLoading, error, data, postData } = useFetch_POST();
  const problem = useSelector((state) => state.problem);
  const formikRef = useRef(null);
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    resolutionScript: Yup.string().required("This feild is required"),
    recommendation: Yup.string().required("This feild is required"),
    serviceName: Yup.string().required("This feild is required"),
    subProblemTitle: Yup.string().required("This feild is required"),
    problemTitle: Yup.string().required("This feild is required"),
  });

  const initialValues = {
    problemTitle: "",
    subProblemTitle: "",
    resolutionScript: "",
    recommendation: "",
    serviceName: "",
  };

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.setValues({
        problemTitle: "",
        subProblemTitle: "",
        resolutionScript: "",
        recommendation: "",
        serviceName: "",
      });
    }
  }, [problem]);

  const handleSubmit = async (values) => {
    values["problemId"] = problem?.problemId;
    values["status"] = "resolved";
    postData(`/save_problem`, values);
  };

  if (data?.status === 201) navigate("/recommendation");

  return (
    <div className="flex justify-center h-body ">
      <div className="m-auto w-[50%] rounded-md overflow-hidden bg-white shadow-sm shadow-slate-400">
        <div className="flex justify-start bg-second p-2">
          <h3 className=" text-white">New Recommendation</h3>
        </div>
        <div className="p-5 mb-5">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            innerRef={formikRef}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className=" mb-2 md:max-w-md mx-auto">
                  <div className="flex justify-start">
                    <h3 className=" text-sm font-semibold">Problem Title:</h3>
                  </div>
                  <div>
                    <Field
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
                      name="problemTitle"
                      type="text"
                      title="Problem title"
                    />
                  </div>
                  <div>
                    <ErrorMessage
                      name="problemTitle"
                      component="div"
                      className="text-red-500 text-xs text-start"
                    />
                  </div>
                </div>

                <div className="flex flex-col mb-2 md:max-w-md mx-auto">
                  <div className="flex justify-start">
                    <h3 className=" text-sm font-semibold">Sub-Problem:</h3>
                  </div>
                  <div>
                    <Field
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
                      name="subProblemTitle"
                      type="text"
                      title="Sub-Problem"
                    />
                  </div>
                  <div>
                    <ErrorMessage
                      name="subProblemTitle"
                      component="div"
                      className="text-red-500 text-xs text-start"
                    />
                  </div>
                </div>

                <div className="flex flex-col mb-2  md:max-w-md mx-auto">
                  <div className="flex justify-start">
                    <h3 className=" text-sm font-semibold">Service Name:</h3>
                  </div>
                  <div>
                    <Field
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
                      name="serviceName"
                      type="text"
                      title="Service-Name"
                    />
                  </div>
                  <div>
                    <ErrorMessage
                      name="serviceName"
                      component="div"
                      className="text-red-500 text-xs text-start"
                    />
                  </div>
                </div>

                <div className="flex flex-col mb-2 md:max-w-md mx-auto">
                  <div className="flex justify-start">
                    <h3 className=" text-sm font-semibold">Resolution Script:</h3>
                  </div>
                  <div>
                    <Field
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
                      name="resolutionScript"
                      type="text"
                      title="Resolution script"
                    />
                  </div>
                  <div>
                    <ErrorMessage
                      name="resolutionScript"
                      component="div"
                      className="text-red-500 text-xs  text-start"
                    />
                  </div>
                </div>

                <div className="flex flex-col mb-4 md:max-w-md mx-auto">
                  <div className="flex justify-start">
                    <h3 className=" text-sm font-semibold">Recommendation:</h3>
                  </div>
                  <div>
                    <Field
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2  focus:outline-none focus:ring-second block w-full p-2.5"
                      name="recommendation"
                      type="text"
                      title="Recommendation"
                    />
                  </div>
                  <div>
                    <ErrorMessage
                      name="recommendation"
                      component="div"
                      className="text-red-500 text-xs text-start"
                    />
                  </div>
                </div>

                <div className="flex flex-col mb-2  md:max-w-md mx-auto">
                <button
                  type="submit"
                  className="text-white w-full bg-main hover:bg-indigo-900 focus:ring-2 focus:outline-none focus:ring-indigo-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
                </div>


              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateNewRuleForm;

