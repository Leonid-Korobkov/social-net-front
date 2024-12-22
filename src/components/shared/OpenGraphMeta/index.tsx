import React from 'react'
import { Helmet } from 'react-helmet'

type OpenGraphMetaProps = {
  title: string
  description: string
  url: string
  image: string
  siteName?: string
  type?: string
}

const OpenGraphMeta: React.FC<OpenGraphMetaProps> = ({
  title,
  description,
  url,
  image,
  siteName,
  type,
}) => {
  return (
    <Helmet>
      {/* Page title */}
      <title>{title}</title>

      {/* OpenGraph metadata */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      {siteName && <meta property="og:site_name" content={siteName} />}
    </Helmet>
  )
}

export default OpenGraphMeta
