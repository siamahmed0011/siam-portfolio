interface PublicFooterProps {
  siteName?: string;
}

export function PublicFooter({ siteName = "Shiam" }: PublicFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner container">
        &copy; {currentYear} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}
