import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import GoogleIcon from '@assets/google-icon.png';
import nitflexApiAxios from "@axios/nitflex-api";

import { useToast } from "src/hooks/useToast";

import { useAuth } from "./AuthProvider";

type GoogleLoginProps = {
  title?: string;
  isLoading?: boolean;
  onSubmit?: () => void;
}

const GoogleLogin = (props: GoogleLoginProps) => {
  const { title = "Login with Google", isLoading = false, onSubmit } = props;
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const toast = useToast();

  const onGoogleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      if (onSubmit) onSubmit();
      const response = await nitflexApiAxios.post('/login/google', { access_token })
      const result = response.data;

      setToken(result.data.access_token);
      localStorage.setItem('token', result.data.access_token);
      if (result.data.access_token)
        toast.success('Login successful!', {
          onClose: () => {
            navigate('/');
          },
        });
    },
    onError: (error) => {
      console.error(error);
      toast.error('An unexpected error occurred');
    },
  });

  return (
    <button
      type="button"
      disabled={isLoading}
      className="btn btn-ghost mt-4"
      onClick={() => onGoogleLogin()}
    >
      <img src={GoogleIcon} alt="google icon" className="size-5" />
      {isLoading ? <span className="loading loading-spinner" /> : title}
    </button>
  )
}

export default GoogleLogin;
