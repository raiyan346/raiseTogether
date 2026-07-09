import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthFromCallback, fetchCurrentUser } from '@/store/slices/authSlice';

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    if (token) {
      dispatch(setAuthFromCallback({ token, refreshToken }));
      dispatch(fetchCurrentUser());
      navigate('/dashboard');
    } else {
      navigate('/login?error=auth');
    }
  }, [params, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted">Completing authentication...</p>
      </div>
    </div>
  );
}
