import { useLoginMutation } from "api/akaza/akazaAPI";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import styles from "./../landing.module.scss";
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
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <div className={styles["password-input-fields"]}>
            <div className={styles["transparent-input-field"]}>
              <div className={styles["input-container"]}>
                <Field
                  name="email"
                  type="text"
                  placeholder="Email"
                  className={`${touched.email && errors.email ? styles["input-error"] : ""}`}
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className={styles["error-label"]}
              />
            </div>
            <div className={styles["transparent-input-field"]}>
              <div className={styles["input-container"]}>
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`${touched.password && errors.password ? styles["input-error"] : ""}`}
                />
                <button
                  type="button"
                  className={styles["toggle-visibility"]}
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
                className={styles["error-label"]}
              />
            </div>
            <div className={styles["outer-error-label"]}>
              {apiLoginErrorMessage ? apiLoginErrorMessage : ""}
            </div>
          </div>

          <div className={styles["login-options"]}>
            <div>
              <Field type="checkbox" name="rememberMe" />
              <label>Remember me</label>
            </div>
            <div className={styles["forgot-password"]}>Forgot password?</div>
          </div>

          <div className={styles["action-buttons"]}>
            <button
              type="submit"
              className={styles["button-custom-orange"]}
              disabled={isSubmitting}
            >
              <img
                src={button_loading_spinner}
                alt="Loading"
                className={styles["button-spinner"]}
                hidden={!isSubmitting}
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
