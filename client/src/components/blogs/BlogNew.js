// BlogNew shows BlogForm and BlogFormReview
import React, { useState } from 'react';
import { reduxForm } from 'redux-form';
import BlogForm from './BlogForm';
import BlogFormReview from './BlogFormReview';

const BlogNew = () => {
  const [showFormReview, setShowFormReview] = useState(false);

  return (
    <div>
      {showFormReview
        ? <BlogFormReview onCancel={() => setShowFormReview(false)} />
        : <BlogForm onBlogSubmit={() => setShowFormReview(true)} />
      }
    </div>
  );
}

export default reduxForm({
  form: 'blogForm'
})(BlogNew);
