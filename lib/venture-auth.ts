export type VentureId = 'ai-automation-agency' | 'social-drive-marketing-agency' | 'anytimetiffin';
export type UserRole = 'customer' | 'rider';

export type VentureAuthConfig = {
  id: VentureId;
  slug: string;
  name: string;
  shortName: string;
  tag: string;
  href: string;
  appHref: string;
  authHref: string;
  customerDashboardHref: string;
  riderDashboardHref: string;
  description: string;
  authDescription: string;
  customerRoleDescription: string;
  riderRoleDescription: string;
  customerDashboardDescription: string;
  riderDashboardDescription: string;
  customerPrimaryHref: string;
  riderPrimaryHref: string;
  customerPrimaryLabel: string;
  riderPrimaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export const ventureRoles = ['customer', 'rider'] as const;

export const ventureAuthConfigs: VentureAuthConfig[] = [
  {
    id: 'ai-automation-agency',
    slug: 'ai-automation-agency',
    name: 'AI Automation Agency',
    shortName: 'AI Automation',
    tag: 'AI Venture',
    href: '/ventures/ai-automation-agency/',
    appHref: '/ai-automation-agency/index.html',
    authHref: '/ventures/ai-automation-agency/auth/',
    customerDashboardHref: '/ventures/ai-automation-agency/customer/',
    riderDashboardHref: '/ventures/ai-automation-agency/rider/',
    description:
      'AI chatbots, WhatsApp automation, CRM workflows, voice agents, and operational systems for businesses that want to scale faster.',
    authDescription: 'Phone OTP access for AI Automation Agency clients and implementation operators.',
    customerRoleDescription: 'View automation requests, payments, proposals, and project handover notes.',
    riderRoleDescription: 'Access operator tasks, setup checklists, and implementation workflow notes.',
    customerDashboardDescription: 'Access AI automation requests, payments, proposals, and client project links.',
    riderDashboardDescription: 'Access implementation tasks, field notes, and AI automation delivery workflows.',
    customerPrimaryHref: '/pay/?venture=ai-automation-agency',
    riderPrimaryHref: '/ai-automation-agency/index.html',
    customerPrimaryLabel: 'Open AI payments',
    riderPrimaryLabel: 'Open AI venture',
    secondaryHref: '/ai-automation-agency/index.html',
    secondaryLabel: 'Open venture page'
  },
  {
    id: 'social-drive-marketing-agency',
    slug: 'social-drive-marketing-agency',
    name: 'Social Drive Marketing Agency',
    shortName: 'Social Drive',
    tag: 'Marketing Venture',
    href: '/ventures/social-drive-marketing-agency/',
    appHref: '/social-drive/index.html',
    authHref: '/ventures/social-drive-marketing-agency/auth/',
    customerDashboardHref: '/ventures/social-drive-marketing-agency/customer/',
    riderDashboardHref: '/ventures/social-drive-marketing-agency/rider/',
    description:
      'ROI-focused social media marketing, campaign systems, reporting, client portal flow, and growth support for brands.',
    authDescription: 'Phone OTP access for Social Drive clients and campaign operators.',
    customerRoleDescription: 'View campaign requests, reports, package payments, and manager updates.',
    riderRoleDescription: 'Access campaign operations, content tasks, and field execution workflows.',
    customerDashboardDescription: 'Access campaign requests, reports, payment links, and Social Drive support.',
    riderDashboardDescription: 'Access campaign task notes, content workflow, and operation assignments.',
    customerPrimaryHref: '/pay/?venture=social-drive-marketing-agency',
    riderPrimaryHref: '/social-drive/index.html',
    customerPrimaryLabel: 'Open marketing payments',
    riderPrimaryLabel: 'Open Social Drive',
    secondaryHref: '/social-drive/index.html',
    secondaryLabel: 'Open venture page'
  },
  {
    id: 'anytimetiffin',
    slug: 'anytime-tiffin',
    name: 'AnyTimeTiffin',
    shortName: 'AnyTime Tiffin',
    tag: 'Food Venture',
    href: '/ventures/anytime-tiffin/',
    appHref: '/anytimetiffin-order/index.html',
    authHref: '/ventures/anytime-tiffin/auth/',
    customerDashboardHref: '/ventures/anytime-tiffin/customer/',
    riderDashboardHref: '/ventures/anytime-tiffin/rider/',
    description:
      'A local homemade tiffin venture for M3M Soulitude with WhatsApp ordering, subscriptions, resident updates, and Google Sheets lead capture.',
    authDescription: 'Phone OTP access for AnyTimeTiffin customers and delivery riders.',
    customerRoleDescription: 'Order meals, manage subscriptions, track payments, and save delivery preferences.',
    riderRoleDescription: 'Access delivery routes, pickup notes, and M3M Soulitude operation workflows.',
    customerDashboardDescription: 'Access the live tiffin order app, meal subscriptions, saved preferences, and payments.',
    riderDashboardDescription: 'Access delivery coordination, customer handoff notes, and route operation links.',
    customerPrimaryHref: '/anytimetiffin-order/index.html',
    riderPrimaryHref: '/anytimetiffin-order/index.html#areas',
    customerPrimaryLabel: 'Open tiffin order app',
    riderPrimaryLabel: 'Open delivery area',
    secondaryHref: '/pay/?venture=anytimetiffin',
    secondaryLabel: 'Open tiffin payment'
  }
];

export function getVentureAuthConfig(slug: string) {
  return ventureAuthConfigs.find((venture) => venture.slug === slug || venture.id === slug) || null;
}

export function getVentureDashboardHref(venture: VentureAuthConfig, role: UserRole) {
  return role === 'customer' ? venture.customerDashboardHref : venture.riderDashboardHref;
}

export function getVentureStorageKeys(ventureId: VentureId) {
  const prefix = `deepanshu.ventures.${ventureId}`;

  return {
    authToken: `${prefix}.authToken`,
    userProfile: `${prefix}.userProfile`,
    selectedRole: `${prefix}.selectedRole`,
    otpAttempt: `${prefix}.otpAttempt`
  };
}
