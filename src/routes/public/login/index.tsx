import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from "react-router-dom";

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { handle_login, LoginParams } from '@apis/auth';
import { useToast } from '@libs/hooks/useToast';

import { useAuth } from '@components/AuthProvider';
import GoogleLogin from '@components/GoogleLogin';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').min(1, 'Password is required'),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginParams>({
    resolver: zodResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const toast = useToast();

  const onSubmit = async (data: LoginParams) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const response = await handle_login(data);
      const result = response.data;

      if (result.data?.AccessToken) {
        setToken(result.data.AccessToken);
        localStorage.setItem('token', result.data.AccessToken);
        toast.success('Login successful!', {
          onClose: () => {
            navigate('/');
          },
        });
      } else {
        toast.error(result.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(error);
      toast.error('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100dvh-5rem)] flex items-center justify-center bg-base-200">
      <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          <div className="form-control">
            <label className="label" htmlFor="email">
              <p className="label-text">
                Username
                <span className="text-red-500">*</span>
              </p>
            </label>
            <input
              type="string"
              id="email"
              className={`input input-bordered ${errors.username ? 'input-error' : ''}`}
              {...register('username')}
            />
            {errors.username && (
              <p className="label-text-alt text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="form-control">
            <label className="label" htmlFor="password">
              <p className="label-text">
                Password
                <span className="text-red-500">*</span>
              </p>
            </label>
            <input
              type="password"
              id="password"
              className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
              {...register('password')}
            />
            {errors.password && (
              <p className="label-text-alt text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="form-control mt-6">
            <button
              disabled={isSubmitting}
              type="submit"
              className="btn btn-primary"
            >
              {isSubmitting ? <span className="loading loading-spinner" /> : 'Sign In'}
            </button>

            <GoogleLogin isLoading={isSubmitting} onSubmit={(value) => setIsSubmitting(value)} />

            <div className="divider">OR</div>
            <div className="flex flex-col gap-2 text-center">
              <Link to="/register" className="link link-primary">
                Don't have an account? Sign up
              </Link>
              <Link to="/reset-password" className="link link-primary">
                Forgot Password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default {
  path: '/login',
  main: Login,
}