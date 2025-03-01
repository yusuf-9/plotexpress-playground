import React from "react";
import "./loader.scss";

type Props = {
  loadingPercentage?: number;
};

function LoadingOverlay(props: Props) {
  const { loadingPercentage } = props;

  return (
    <div className="absolute left-0 top-0 w-screen h-screen flex justify-center items-center bg-main">
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="loader">
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__ball"></div>
        </div>
        {loadingPercentage && (
          <div className="flex items-stretch justify-start h-1.5 w-40 bg-main-dark/70 rounded-md">
            <div
              className="bg-white h-full rounded-md transition-all duration-200"
              style={{ width: `${loadingPercentage}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoadingOverlay;
