const FALLBACK_SITE_URL = 'https://naincsc.netlify.app'

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export const siteBasePath = rawBasePath === '/' ? '' : rawBasePath.replace(/\/$/, '')

export const siteConfig = {
  name: 'Nain Photostate & Online Center',
  shortName: 'Nain Photostate',
  siteUrl: rawSiteUrl.replace(/\/$/, ''),
  locale: 'hi_IN',
  defaultImage: '/images/Shop.jpeg',
  description:
    'Nain Photostate CSC and online center in Danoda Kalan, Jind for Family ID, Aadhaar, PAN card, jobs, forms, college admission, pension, LPG and digital services.',
  keywords: [
    'Nain Photostate',
    'Nain Photostate CSC',
    'CSC Danoda Kalan',
    'CSC Jind',
    'online center Danoda Kalan',
    'government forms Jind',
    'Family ID service',
    'Aadhaar update center',
    'job forms Jind',
    'Nain CSC',
  ],
  phone: '+91 8950101037',
  email: 'dnain81@gmail.com',
  address: {
    locality: 'Danoda Kalan',
    region: 'Haryana',
    country: 'IN',
  },
}

export function withBasePath(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return siteBasePath ? `${siteBasePath}${normalizedPath}` : normalizedPath
}

export function getAbsoluteUrl(path = '/') {
  return path === '/' ? siteConfig.siteUrl : `${siteConfig.siteUrl}${path}`
}

export function buildMetadata({
  title,
  description,
  path = '/',
  keywords = [],
  image = siteConfig.defaultImage,
  noIndex = false,
}) {
  const canonicalUrl = getAbsoluteUrl(path)
  const pageTitle = title || 'CSC & Online Center in Danoda Kalan'
  const sharingTitle = `${pageTitle} | ${siteConfig.shortName}`
  const metaDescription = description || siteConfig.description
  const allKeywords = [...new Set([...siteConfig.keywords, ...keywords])]

  return {
    title: pageTitle,
    description: metaDescription,
    keywords: allKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: sharingTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
      images: [
        {
          url: getAbsoluteUrl(image),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: sharingTitle,
      description: metaDescription,
      images: [getAbsoluteUrl(image)],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  }
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.siteUrl}/#website`,
        url: siteConfig.siteUrl,
        name: siteConfig.name,
        alternateName: siteConfig.shortName,
        inLanguage: 'hi-IN',
        description: siteConfig.description,
      },
      {
        '@type': 'Organization',
        '@id': `${siteConfig.siteUrl}/#organization`,
        name: siteConfig.name,
        alternateName: 'Nain Photostate CSC',
        url: siteConfig.siteUrl,
        logo: getAbsoluteUrl('/images/Shop.jpeg'),
        telephone: siteConfig.phone,
        email: siteConfig.email,
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${siteConfig.siteUrl}/#localbusiness`,
        name: siteConfig.name,
        image: getAbsoluteUrl('/images/Shop.jpeg'),
        url: siteConfig.siteUrl,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        address: {
          '@type': 'PostalAddress',
          addressLocality: siteConfig.address.locality,
          addressRegion: siteConfig.address.region,
          addressCountry: siteConfig.address.country,
        },
        areaServed: ['Danoda Kalan', 'Jind', 'Haryana'],
        description: siteConfig.description,
        keywords: siteConfig.keywords.join(', '),
      },
    ],
  }
}

export const homeFaqs = [
  {
    question: 'Nain Photostate par kaun kaun si CSC services milti hain?',
    answer:
      'Yahan Family ID, Aadhaar, PAN card, Ayushman card, job forms, college admission, pension, scholarship, ration card aur kai online CSC services ek hi jagah milti hain.',
  },
  {
    question: 'Kya yeh Danoda Kalan ke aas paas ke logon ke liye local online center hai?',
    answer:
      'Haan, Nain Photostate Danoda Kalan, Jind aur nearby villages ke customers ke liye local photostate, CSC aur online document help center ke roop me kaam karta hai.',
  },
  {
    question: 'Yahan job aur college form bharwane ki service milti hai?',
    answer:
      'Haan, sarkari job forms, HKRN, HSSC, CET, scholarship aur college admission forms ke liye support diya jata hai.',
  },
  {
    question: 'Customer ko contact karne ka sabse fast tarika kya hai?',
    answer:
      'Call ya WhatsApp par +91 8950101037 par direct contact kiya ja sakta hai. Contact page par map aur review links bhi available hain.',
  },
]

