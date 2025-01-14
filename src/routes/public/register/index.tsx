import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { handle_register, RegisterParams } from '@apis/auth';
import { useToast } from '@libs/hooks/useToast';

import GoogleLogin from '@components/GoogleLogin';

const schema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').min(1, 'Password is required'),
}).required();

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterParams>({
    resolver: zodResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (data: RegisterParams) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const response = await handle_register(data);
      if (response.status === 200)
        toast.success('An activation link has been sent to your email!', {
          autoClose: 2000,
          onClose: () => {
            navigate('/login');
          },
        });
    } catch (error) {
      toast.error('An unexpected error occurred');
      setIsSubmitting(false);
      console.error(error);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-base-200">
      <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          <div className="form-control">
            <label className="label" htmlFor="email">
              <p className="label-text">
                Email
                <span className="text-red-500">*</span>
              </p>
            </label>
            <input
              type="email"
              id="email"
              className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
              {...register('email')}
            />
            {errors.email && (
              <p className="label-text-alt text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="username">
              <p className="label-text">
                Username
                <span className="text-red-500">*</span>
              </p>
            </label>
            <input
              type="string"
              id="username"
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
              {isSubmitting ? <span className="loading loading-spinner" /> : 'Sign Up'}
            </button>

            <GoogleLogin
              isLoading={isSubmitting}
              title="Register with Google"
              onSubmit={(value) => setIsSubmitting(value)}
            />

            <div className="divider">OR</div>
            <div className="text-center">
              <Link to="/login" className="link link-primary">
                Already have an account?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default {
  path: '/register',
  main: Register,
}