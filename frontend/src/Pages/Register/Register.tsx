import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import "./Register.css";
import { useNotification } from "../../context/NotificationContext";
import { UserContext } from "../../context/UserContext";
import Cookies from "js-cookie";
import { registerAction } from "../../api/PostFetches";

const formSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email format")
      .max(40, "The maximum length of 40 characters has been exceeded"),
    password: z
      .string()
      .min(8, "The password must contain at least 8 characters")
      .max(40, "The maximum length of 40 characters has been exceeded")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        "The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"],
  });

function Register() {
  const { setUser } = useContext(UserContext);
  const { showNotification } = useNotification();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  async function handleRegistrationSubmit(data: FieldValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await registerAction(data);

      reset();
      if (response.status === 201) {
        if (response && setUser) {
          const { user } = response.data;
          const { id, username, role } = user;

          setUser({
            id: id,
            username: username,
            role: role,
          });
        }
        Cookies.set("isLoggedIn", "true", {
          expires: 7,
          secure: true,
          sameSite: "None",
        });

        navigate("/");
        showNotification("Registered successfully!", {
          backgroundColor: "green",
          textColor: "white",
          duration: 3000,
        });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setServerError(error.response.data.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="register-container">
      <form
        onSubmit={handleSubmit(handleRegistrationSubmit)}
        noValidate
        className="register-form"
      >
        <h1 className="form-title">Sign Up</h1>
        <input
          autoComplete="email"
          placeholder="e-mail"
          type="email"
          {...register("email")}
          className="form-input"
        />
        {errors.email && (
          <p className="error-text">{errors.email.message?.toString()}</p>
        )}
        <input
          autoComplete="current-password"
          placeholder="password"
          type="password"
          {...register("password")}
          className="form-input"
        />
        {errors.password && (
          <p className="error-text">{errors.password.message?.toString()}</p>
        )}
        <input
          autoComplete="new-password"
          placeholder="confirm password"
          type="password"
          {...register("confirmPassword")}
          className="form-input"
        />
        {errors.confirmPassword && (
          <p className="error-text">
            {errors.confirmPassword.message?.toString()}
          </p>
        )}
        <p className="password-requirements">
          The password must contain at least 8 characters, one uppercase letter,
          one lowercase letter, one number, and one special character.
        </p>
        <button
          onClick={() => setServerError(null)}
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          Sign Up
        </button>
        <h3 className="error-text">{serverError}</h3>
      </form>
    </div>
  );
}

export default Register;
