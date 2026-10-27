import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Home } from 'lucide-react';
import Button from '../components/ui/Button';

/**
 * @param {string} [title='Page Not Found']
 * @param {string} [message]
 * @param {string} [backTo='/']
 * @param {string} [backLabel='Back to Home']
 */

const NotFound = ({
  title = 'Page Not Found',
  message = "The page you're looking for doesn't exist or may have been moved. Let's get you back on track.",
  backTo = '/',
  backLabel = 'Back to Home',
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">

          <p aria-hidden="true" className="text-[10rem] lg:text-[14rem] font-bold leading-none text-border select-none">
            404
          </p>

          {/* Floating card — sits over the 404 text */}
          <div className="-mt-10 lg:-mt-16 relative z-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              {title}
            </h1>
            <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
              {message}
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
              <Button as={Link} to={backTo} variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                <Home className="w-4 h-4" />
                {backLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NotFound;