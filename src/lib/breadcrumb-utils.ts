export interface BreadcrumbItem {
  label: string
  href?: string
}

// Structured data for breadcrumbs
export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  const allItems = [
    { label: 'Home', href: '/' },
    ...items
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${item.href}` : undefined
    }))
  }
}
