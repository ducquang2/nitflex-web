import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import GoogleIcon from '@assets/images/google-icon.png';
import nitflexApiAxios from "@libs/axios/nitflex-api";

import { useToast } from "src/libs/hooks/useToast";

import { useAuth } from "./AuthProvider";

type GoogleLoginProps = {
  title?: string;
  isLoading?: boolean;
  onSubmit?: (isSuccess: boolean) => void;
}

const GoogleLogin = (props: GoogleLoginProps) => {
  const { title = "Login with Google", isLoading = false, onSubmit } = props;
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const toast = useToast();

  const onGoogleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const response = await nitflexApiAxios.post('/login/google', { AccessToken: access_token })
        const result = response.data;

        setToken(result.data.AccessToken);
        localStorage.setItem('token', result.data.AccessToken);
        if (onSubmit) onSubmit(true);
        if (result.data.AccessToken)
          toast.success('Login successful!', {
            onClose: () => {
              navigate('/');
            },
          });
      } catch (error) {
        console.error(error);
        toast.error('Login failed!');
        if (onSubmit) onSubmit(false);
      }
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
