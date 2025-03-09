import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Cookies from "js-cookie";
import "./Login.css";
import { useNotification } from "../../context/NotificationContext";
import { UserContext } from "../../context/UserContext";
import { loginAction } from "../../api/PostFetches";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(40, "The maximum length of 40 characters has been exceeded"),
  password: z
    .string()
    .min(8, "The password must contain at least 8 characters")
    .max(40, "The maximum length of 40 characters has been exceeded"),
});

function Login() {
  const { setUser } = useContext(UserContext);
  const { showNotification } = useNotification();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  async function handleLoginSubmit(data: FieldValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await loginAction(data);

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
      reset();
      navigate("/");
      showNotification("Signed in successfully!", {
        backgroundColor: "green",
        textColor: "white",
        duration: 3000,
      });
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred during login."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-container">
      <form
        onSubmit={handleSubmit(handleLoginSubmit)}
        noValidate
        className="login-form"
      >
        <h1 className="form-title">Sign in</h1>
        <input
          autoComplete="email"
          placeholder="e-mail"
          {...register("email")}
          type="email"
          className="form-input"
        />
        {errors.email && (
          <p className="error-text">{errors.email.message?.toString()}</p>
        )}
        <input
          autoComplete="current-password"
          placeholder="password"
          {...register("password")}
          type="password"
          className="form-input"
        />
        {errors.password && (
          <p className="error-text">{errors.password.message?.toString()}</p>
        )}
        <div>
          <button
            onClick={() => setErrorMessage(null)}
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            Sign in
          </button>
        </div>
        <p className="error-text">{errorMessage}</p>
      </form>
    </main>
  );
}

export default Login;
