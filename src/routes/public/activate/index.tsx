import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { active_account } from '@apis/auth';
import { useToast } from '@libs/hooks/useToast';

const ActivateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isActivating, setIsActivating] = useState(true);

  useEffect(() => {
    const activate = async () => {
      const token = new URLSearchParams(location.search).get('token');
      if (token) {
        try {
          await active_account(token);
          toast.success('Account activated successfully!', {
            onClose: () => {
              navigate('/login');
            },
          });
        } catch (error) {
          toast.error('Failed to activate account');
          console.error(error);
        } finally {
          setIsActivating(false);
        }
      } else {
        toast.error('Invalid activation token');
        setIsActivating(false);
      }
    };

    activate();
  }, [location, toast, navigate]);

  return (
    <div className="h-[calc(100dvh-5rem)] flex items-center justify-center bg-base-200">
      <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body text-center">
          {isActivating ? (
            <div className="loading loading-spinner"></div>
          ) : (
            <>
              <h2 className="card-title">Account Activated</h2>
              <p>Your account has been successfully activated. You can now log in.</p>
              <div className="form-control mt-6">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default {
  path: '/activate',
  main: ActivateAccount,
}
