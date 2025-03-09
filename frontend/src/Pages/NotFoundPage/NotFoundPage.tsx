import "./NotFoundPage.css";

export default function NotFound() {
  return (
    <div>
      <div className="not-found-container">
        <div className="not-found-wrapper">
          <div className="not-found-content">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-subtitle">Oops! Page not found</p>
            <p className="not-found-text">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <a href="/" className="not-found-button">
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
