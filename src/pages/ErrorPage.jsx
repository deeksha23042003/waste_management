import React from 'react';
import './ErrorPage.css';
import { Link } from 'react-router-dom';
const ErrorPage = () => {
  return (
    <div className="error-page"  style={{width:"100vw"}} >
      
      <main className="error-page__main" style={{width:"100vw"}}>
        <div className="error-page__bg-blur error-page__bg-blur--top"></div>
        <div className="error-page__bg-blur error-page__bg-blur--bottom"></div>
        
        <div className="error-page__container">
          <div className="error-page__grid">
            <div className="error-page__content">
              <div className="error-page__badge">
                <span className="material-symbols-outlined error-page__badge-icon">search_off</span>
                <span>404 Page Not Found</span>
              </div>

              <div className="error-page__text-section">
                <h1 className="error-page__title">
                  Whoops! <br/>
                  This bin is <span className="error-page__title-highlight">empty</span>.
                </h1>
                <p className="error-page__description">
                  It seems you've wandered into an uncharted sector of the landfill. The page you are looking for has either been recycled or moved to a different facility.
                </p>
              </div>

              <div className="error-page__buttons">
                <Link className="error-page__button error-page__button--primary" to="/" >
                  Go Back Home
                </Link>
                
              </div>

            </div>

            <div className="error-page__image-section">
              <div className="error-page__image-container">
                <div className="error-page__image-glow"></div>
                <div className="error-page__image-accent"></div>
                <div className="error-page__image-card">
                  <div 
                    className="error-page__image-bg"
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvy4DYRw7GmSR8-26Xb3hRD0ebNm5qDIYuJ1c61oWjSnl87p-FrN1PmiLmRVeHTB7hvm1feVx8w9f8bIr0eE2s5OIcOTHcB0ne26y_rT5Zo_7YESqjchJM8CGwnuDtvs97iO8hVxaNdC4DAiT304gmm1qN_E1Mv0TrSVXsVoRS4JKn2YU7HqHR-MdVgYmI6Uabqui63gA2HxW8jND4tRcGjktUJ4EJzPhaLh4R8JdNMgnAk5kwEpCeePK0N-N2xBq03mHkXUOpEiom")'}}
                  ></div>
                  <div className="error-page__image-overlay"></div>
                  <div className="error-page__image-label">
                    <div className="error-page__image-label-content">
                      <p className="error-page__image-label-text">
                        <span className="material-symbols-outlined error-page__image-label-icon">location_disabled</span>
                        Unknown Location
                      </p>
                    </div>
                  </div>
                </div>
               
               
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="error-page__footer">
        <div className="error-page__footer-content">
          <p className="error-page__footer-text">
            © 2024 GreenSort Waste Management.
          </p>
          <div className="error-page__footer-links">
            <a className="error-page__footer-link" href="#">Privacy</a>
            <a className="error-page__footer-link" href="#">Terms</a>
            <a className="error-page__footer-link" href="#">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ErrorPage;