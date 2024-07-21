import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import useFetch_POST from "../../services/http/Post";
import { setNewRemediation } from "../../app/features/modals_view/modal";

const CreateNewRuleForm = () => {
  const { isLoading, error, data, postData } = useFetch_POST();
  const problem = useSelector((state) => state.problem);
  const dispatch = useDispatch();
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
    <div className="bg-blur flex h-lvh justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50  items-center w-full md:inset-0  max-h-full">
      <div className="m-auto  relative  w-full max-w-md max-h-full rounded-md overflow-hidden bg-white shadow-sm shadow-slate-400">
        <div className="flex justify-between p-4 border-b border-gray-300">
          <h3 className=" text-lg font-bold">New Recommendation</h3>
          <button
            onClick={() => dispatch(setNewRemediation(false))}
            type="button"
            className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
         
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <div className="p-5">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            innerRef={formikRef}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className=" md:max-w-md mx-auto">
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
                    <h3 className=" text-sm font-semibold">
                      Resolution Script:
                    </h3>
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

                <div className="flex flex-col  md:max-w-md mx-auto">
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
