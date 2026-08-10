import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">

          <p className="text-[10rem] lg:text-[14rem] font-bold leading-none text-slate-200 select-none">
            404
          </p>

          {/* Floating card — sits over the 404 text */}
          <div className="-mt-10 lg:-mt-16 relative z-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
              Page Not Found
            </h1>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">
              The page you're looking for doesn't exist or may have been moved.
              Let's get you back on track.
            </p>

            {/* Primary actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto flex justify-center items-center gap-2 cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              <Link to="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full flex justify-center items-center gap-2 cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NotFound;