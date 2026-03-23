"use client";

import { Article } from "@/types";
import { siteConfig } from "@/lib/config";

interface BreadcrumbSchemaProps {
  article: Article;
}

export function BreadcrumbSchema({ article }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.category,
        item: `${siteConfig.url}/category/${article.category
          .toLowerCase()
          .replace(/\s+/g, "-")}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
