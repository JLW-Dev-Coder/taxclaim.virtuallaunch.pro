import { headers } from 'next/headers';
import ClaimClient from './ClaimClient';
import { getProBySlug, TaxPro } from '@/lib/api';

export const runtime = 'edge';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ClaimPage({ params }: Props) {
  const { slug } = await params;

  // Check x-pro-slug header (set by middleware for subdomain rewrites)
  const headersList = await headers();
  const proSlug = headersList.get('x-pro-slug') ?? slug;

  const pro = await getProBySlug(proSlug);

  return <ClaimClient pro={pro} slug={proSlug} />;
}
