export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 text-center md:text-left">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="font-medium italic">Your premium Next.js template.</span>
        </div>
      </div>
    </footer>
  );
}
