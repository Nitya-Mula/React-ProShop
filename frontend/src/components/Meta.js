import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description}></meta>
      <meta name='keyword' content={keywords}></meta>
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to Pro-Shop',
  description: 'We sell the beset products for reasonable prices',
  keywords: 'electronics, buy electronics, cheap electronics',
}

export default Meta
