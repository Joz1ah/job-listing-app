import { useState, useRef, useEffect } from "react";
import { Eye } from "lucide-react";
import styles from "./../landing.module.scss";
import { FieldProps } from "formik";

interface CustomInputProps extends FieldProps {
  placeholder?: string;
  type?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ field, form, ...props }) => {
  const [inputType, setInputType] = useState("password");
  const eyeIcon = useRef<HTMLImageElement>(null);
  const handleEyeIcon = () => {
    if (eyeIcon.current) {
      eyeIcon.current.onclick = () => {
        if (inputType == "password") {
          setInputType("text");
        } else {
          setInputType("password");
        }
      };
    }
  };
  useEffect(handleEyeIcon, []);

  return (
    <div className={`${styles["transparent-input-field"]}`}>
      <div className={`${styles["input-container"]}`}>
        <input type={inputType} {...field} {...props} required></input>
        {props.type == "password" ? <Eye /> : ""}
      </div>
    </div>
  );
};

export default CustomInput;
