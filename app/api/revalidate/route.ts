import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

export function getTagsForType(type: string): string[] {
  const knownTypes = [
    "property", "farmlandOption", "testimonial", "faq", "stat", "service",
    "processStep", "partnerLogo", "promiseItem", "siteSettings", "homePage",
    "categoryPage", "contactPage",
  ];
  return knownTypes.includes(type) ? [type] : [];
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret || !signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body) as { _type?: string };
  if (!payload._type) {
    return NextResponse.json({ message: "No _type in payload" }, { status: 400 });
  }

  const tags = getTagsForType(payload._type);
  tags.forEach((tag) => {
    revalidateTag(tag, {});
  });

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
