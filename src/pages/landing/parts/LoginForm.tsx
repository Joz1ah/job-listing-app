import { useLoginMutation } from "api/akaza/akazaAPI";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import * as Yup from "yup";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm = () => {
  const [loginSubmit] = useLoginMutation();
  const [apiLoginErrorMessage, setApiLoginErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setFieldError }: any,
  ) => {
    try {
      const response = await loginSubmit(values).unwrap();

      // Check if we have the token in the response
      if (response?.data?.token) {
        // Login with auth context
        login(response.data.token);

        const userType = response.data.user?.type;
        const isFreeTrial = response.data.user?.freeTrial;

        // Store user preferences
        localStorage.setItem("userType", userType);
        localStorage.setItem(
          "subscriptionTier",
          isFreeTrial ? "freeTrial" : "monthlyPlan",
        );

        // Navigate after successful login
        setTimeout(() => {
          if (userType === "employer") {
            navigate("/dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      } else {
        throw new Error("No token received");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Handle API-specific errors
      if (err.status === 401) {
        setApiLoginErrorMessage("Invalid Username or Password");
      } else {
        setApiLoginErrorMessage("An error occurred during login");
      }
      setFieldError("general", "Invalid Username or Password");
    } finally {
      setSubmitting(false);
    }
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <Formik<LoginFormValues>
      initialValues={{ email: "", password: "", rememberMe: false }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, values: { email, password } }) => (
        <Form className="flex flex-col gap-[10px] w-full py-8">
          <div className="text-left">
            <h1 className="text-[14px] font-bold text-[#F5722E]">
              Job Hunter Login
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <div className="relative">
                <Field
                  name="email"
                  type="text"
                  placeholder="Email"
                  className={`w-full p-2 border-b-2 focus:border-orange-500 focus:outline-none ${touched.email && errors.email ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div>
              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full p-2 border-b-2 focus:border-orange-500 focus:outline-none ${touched.password && errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="text-red-500 text-sm mt-1">
              {apiLoginErrorMessage ? apiLoginErrorMessage : ""}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Field type="checkbox" name="rememberMe" className="mr-2" />
              <label className="text-[10px]">Remember me</label>
            </div>
            <div className="text-[10px] text-[#F5722E] cursor-pointer">
              Forgot password?
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className={`${email && password ? "bg-[#F5722E]" : "bg-[#AEADAD]"} text-white py-2 px-4 rounded disabled:opacity-50 w-full h-[45px]`}
              disabled={isSubmitting || !email || !password}
            >
              <img
                src={button_loading_spinner}
                alt="Loading"
                className={`inline-block mr-2 h-full ${isSubmitting ? "block animate-spin" : "hidden"}`}
              />
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
