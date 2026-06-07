import type { MetadataRoute } from 'next';
import { insightPosts, seoPages, siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date('2026-06-07');
  const staticRoutes = [
    '',
    '/ventures/',
    '/anytimetiffin/',
    '/anytimetiffin-order/index.html',
    '/ai-automation-agency/index.html',
    '/social-drive/index.html'
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.86
    })),
    ...seoPages.map((page) => ({
      url: `${siteUrl}/${page.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.88
    })),
    ...insightPosts.map((post) => ({
      url: `${siteUrl}/insights/${post.slug}/`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.72
    }))
  ];
}
