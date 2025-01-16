import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { forgot_password_request, reset_password } from '@apis/auth';
import { useToast } from '@libs/hooks/useToast';

type ResetPasswordEmail = {
  email: string;
}

type ResetPasswordPassword = {
  newPassword: string;
  confirmPassword: string;
}

const emailSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const ResetPassword = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [resetToken, setResetToken] = useState('');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const { register: registerEmail, handleSubmit: handleSubmitEmail, formState: { errors: emailErrors } } = useForm<ResetPasswordEmail>({
    resolver: zodResolver(emailSchema),
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors } } = useForm<ResetPasswordPassword>({
    resolver: zodResolver(passwordSchema),
  });

  const handleForgotPassword = async (data: { email: string }) => {
    try {
      await forgot_password_request(data);
      toast.success('Password reset link sent successfully, please check your email');
    } catch (error) {
      toast.error('Failed to send password reset link');
      console.error(error);
    }
  };

  const handleResetPassword = async (data: { newPassword: string }) => {
    try {
      await reset_password({ token: resetToken, password: data.newPassword });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Failed to reset password');
    }
  };

  useEffect(() => {
    if (location.search && location.search.includes('token')) {
      const token = new URLSearchParams(location.search).get('token');
      setResetToken(token || '');
      if (token) {
        setStep(2);
      }
    }
  }, [location])

  return (
    <div className="h-[calc(100dvh-5rem)] flex items-center justify-center bg-base-200">
      <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        {step === 1 ? (
          <form onSubmit={handleSubmitEmail(handleForgotPassword)} className="card-body">
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
                className={`input input-bordered ${emailErrors.email ? 'input-error' : ''}`}
                {...registerEmail('email')}
              />
              {emailErrors.email && (
                <p className="label-text-alt text-red-500">{emailErrors.email.message}</p>
              )}
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Send Reset Link
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitPassword(handleResetPassword)} className="card-body">
            <div className="form-control relative">
              <label className="label" htmlFor="newPassword">
                <p className="label-text">
                  New Password
                  <span className="text-red-500">*</span>
                </p>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className={`input input-bordered ${passwordErrors.newPassword ? 'input-error' : ''}`}
                {...registerPassword('newPassword')}
              />
              <span
                className="absolute right-3 top-12 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="icon-eye-mini" />
                ) : (
                  <i className="icon-eye-off-mini" />
                )}
              </span>
              {passwordErrors.newPassword && (
                <p className="label-text-alt text-red-500">{passwordErrors?.newPassword?.message}</p>
              )}
            </div>
            <div className="form-control">
              <label className="label" htmlFor="confirmPassword">
                <p className="label-text">
                  Confirm Password
                  <span className="text-red-500">*</span>
                </p>
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={`input input-bordered ${passwordErrors.confirmPassword ? 'input-error' : ''}`}
                {...registerPassword('confirmPassword')}
              />
              {passwordErrors.confirmPassword && (
                <p className="label-text-alt text-red-500">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default {
  path: '/reset-password',
  main: ResetPassword,
}