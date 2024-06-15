// FadeTransition.js
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './styles.css'; // CSS file for transition styles

const FadeTransition = ({ children, ...props }) => {
  return (
    <CSSTransition
      {...props}
      className="fade"
      timeout={3000} // adjust duration as needed
    >
      {children}
    </CSSTransition>
  );
};

export default FadeTransition;
