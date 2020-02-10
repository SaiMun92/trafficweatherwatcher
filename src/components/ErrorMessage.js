import React from 'react';
import { Alert } from 'react-bootstrap';


export function ErrorMessage() {
    return (
      <Alert variant="danger">
          No results retrieved at the selected date. Please select another date.
      </Alert>
    );
}