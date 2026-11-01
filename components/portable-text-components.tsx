import type { PortableTextComponents } from "@portabletext/react";

export const storyPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-lg leading-relaxed mb-4 last:mb-0">{children}</p>
    ),
    h1: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mt-12 mb-4 text-foreground">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-semibold tracking-tight mt-10 mb-3 text-foreground">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="text-lg sm:text-xl font-semibold mt-8 mb-2 text-foreground">
        {children}
      </h4>
    ),
    h4: ({ children }) => (
      <h5 className="text-base font-semibold mt-6 mb-2 text-foreground">
        {children}
      </h5>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent/40 pl-4 my-6 italic text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 my-4 space-y-2 text-lg leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 my-4 space-y-2 text-lg leading-relaxed">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline underline-offset-2 hover:text-accent-dark"
      >
        {children}
      </a>
    ),
  },
};
