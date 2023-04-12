import { useEffect, useRef, useState } from "react";
import "./App.css";
// to import formik
import { Formik, useFormik } from "formik";

// Errors message
const validate = (values) =>{
  const errors = {}
  if ( Object.values(values.otp).some(data=> data === "")){
    errors.otp = "this field is required"
  }
  return errors
}

const App = () => {
  //  to select first input for typing
  useEffect(() => {
    inputRef.current[0].focus();
    // for user copypast 'code'
    inputRef.current[0].addEventListener("paste", pasteText);
    // to cleanUp code
    return () => inputRef.current[0].removeEventListener("paste", pasteText);
  }, []);
  // copypast clipboard
  const pasteText = (event) => {
    // to getting an index on clipborad
    const pasetedData = event.clipboardData.getData("text");
    const fieldValues = {};
    Object.keys(otp).forEach((key, index) => {
      fieldValues[key] = pasetedData[index];
    });

    // update State value
    setOTP(fieldValues);
    // foucs on last inputBox
    inputRef.current[3].focus();
  };

  //  to getting an inputBox refference
  const inputRef = useRef({});

  // to implement formik hook
  const formik = useFormik({
    initialValues: { otp: Array.from({ length: 4 }).fill("") },
    onSubmit:values =>{
      // data pass to the API
      console.log(values.otp.join(""));
    },
    validate,
  });

  // for getting current input box for nextSibling
  const handleChange = (event, index) => {
    const { value } = event.target;
    // prevent charectors on inputBox
    if (/[a-z]/gi.test(value)) return;

    // update formik
    const currentOTP = [...formik.values.otp];
    currentOTP[index] = value.at(-1);
    formik.setValues((prev) => ({
      ...prev,
      otp: currentOTP,
    }));

    if (value && index < 3) {
      inputRef.current[index + 1].focus();
    }
  };

  // for getting previous input box for pressing backspace
  const handleBackspace = (event, index) => {
    if (event.key === "Backspace") {
      if (index > 0) {
        inputRef.current[index - 1].focus();
      }
    }
  };

  const renderInput = () => {
    return formik.values.otp.map((value, index) => (
      <input
        ref={(element) => (inputRef.current[index] = element)}
        type="text"
        key={index}
        name={index}
        value={value}
        className="w-14 h-12 text-center mr-3 rounded-md text-2xl"
        onChange={(event) => handleChange(event, index)}
        onKeyUp={(event) => handleBackspace(event, index)}
      />
    ));
  };

  return (
    <div className="App">
      <h3 className="text-3xl mb-5 font-bold">enter your OTP here..</h3>
      <Formik>
        <div>{renderInput()}</div>
      </Formik>
      {formik.errors.otp && <p className="mt-3 text-sm text-red-400">Please fill the field..</p>}
      <button
        className="mt-3 w-32 border border-solid border-[#3b3b3b] hover:bg-[#7878789b]"
        type="button"
        onClick={formik.handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default App;
